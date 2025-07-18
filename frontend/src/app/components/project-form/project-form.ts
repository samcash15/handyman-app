import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project';
import { ClientService } from '../../services/client';
import { AppointmentService } from '../../services/appointment';
import { Project, ProjectForm as ProjectFormModel, ProjectStatus, ProjectStatusLabels } from '../../models/project.model';
import { Client } from '../../models/client.model';
import { AppointmentForm } from '../../models/appointment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  appointmentForm: FormGroup;
  isEditMode = false;
  title = 'Add New Project';
  clients: Client[] = [];
  statuses = Object.values(ProjectStatus);
  statusLabels = ProjectStatusLabels;
  scheduleAppointment = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private clientService: ClientService,
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project?: Project, preselectedClient?: Client }
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [ProjectStatus.PENDING, [Validators.required]],
      startDate: [''],
      endDate: [''],
      clientId: ['', [Validators.required]]
    });
    
    this.appointmentForm = this.fb.group({
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      location: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
    
    if (this.data?.project) {
      this.isEditMode = true;
      this.title = 'Edit Project';
      this.projectForm.patchValue({
        name: this.data.project.name,
        description: this.data.project.description,
        status: this.data.project.status,
        clientId: this.data.project.clientId
      });
    } else if (this.data?.preselectedClient) {
      this.title = `New Project for ${this.data.preselectedClient.name}`;
      this.projectForm.patchValue({
        clientId: this.data.preselectedClient.id
      });
    }
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid && (!this.scheduleAppointment || this.appointmentForm.valid)) {
      const formValue = this.projectForm.value;
      const projectData: ProjectFormModel = {
        ...formValue,
        startDate: formValue.startDate ? formValue.startDate.toISOString().split('T')[0] : null,
        endDate: formValue.endDate ? formValue.endDate.toISOString().split('T')[0] : null,
        hourlyRate: 0 // Set default value since it's required by backend but not used
      };
      
      if (this.isEditMode && this.data.project?.id) {
        this.projectService.updateProject(this.data.project.id, projectData).subscribe({
          next: (project) => {
            this.dialogRef.close(project);
          },
          error: (error) => {
            console.error('Error updating project:', error);
          }
        });
      } else {
        this.projectService.createProject(projectData).subscribe({
          next: (project) => {
            if (this.scheduleAppointment) {
              this.createAppointmentForProject(project);
            } else {
              this.dialogRef.close(project);
            }
          },
          error: (error) => {
            console.error('Error creating project:', error);
          }
        });
      }
    }
  }

  createAppointmentForProject(project: Project): void {
    const formValue = this.appointmentForm.value;
    const appointmentData: AppointmentForm = {
      ...formValue,
      clientId: project.clientId,
      projectId: project.id,
      date: formValue.date ? formValue.date.toISOString().split('T')[0] : null
    };
    
    if (formValue.recurring && formValue.recurring !== 'none') {
      // If recurring, create multiple appointments
      this.createRecurringAppointments(appointmentData, project);
    } else {
      // Single appointment
      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (appointment) => {
          this.dialogRef.close({ project, appointment });
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          // Still close with project if appointment creation fails
          this.dialogRef.close(project);
        }
      });
    }
  }

  createRecurringAppointments(appointmentData: AppointmentForm, project: Project): void {
    const appointments: AppointmentForm[] = [];
    const baseDate = new Date(appointmentData.date!);
    const recurringType = appointmentData.recurring;
    
    // Create 4 recurring appointments as an example
    for (let i = 0; i < 4; i++) {
      const appointmentDate = new Date(baseDate);
      
      switch (recurringType) {
        case 'daily':
          appointmentDate.setDate(baseDate.getDate() + i);
          break;
        case 'weekly':
          appointmentDate.setDate(baseDate.getDate() + (i * 7));
          break;
        case 'monthly':
          appointmentDate.setMonth(baseDate.getMonth() + i);
          break;
      }
      
      appointments.push({
        ...appointmentData,
        date: appointmentDate.toISOString().split('T')[0]
      });
    }
    
    // Create all appointments using forkJoin
    const appointmentObservables = appointments.map(apt => 
      this.appointmentService.createAppointment(apt)
    );
    
    forkJoin(appointmentObservables).subscribe({
      next: (createdAppointments) => {
        this.dialogRef.close({ project, appointments: createdAppointments });
      },
      error: (error) => {
        console.error('Error creating recurring appointments:', error);
        this.dialogRef.close(project);
      }
    });
  }

  onScheduleAppointmentChange(): void {
    if (this.scheduleAppointment) {
      this.appointmentForm.reset();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.projectForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
      if (control.errors['maxlength']) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is too long`;
      }
      if (control.errors['min']) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be positive`;
      }
    }
    return '';
  }
}
