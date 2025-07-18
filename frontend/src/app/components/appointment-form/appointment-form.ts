import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment';
import { ClientService } from '../../services/client';
import { ProjectService } from '../../services/project';
import { Appointment, AppointmentForm as AppointmentFormModel, AppointmentStatus, AppointmentStatusLabels } from '../../models/appointment.model';
import { Client } from '../../models/client.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-appointment-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss'
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  title = 'Schedule New Appointment';
  clients: Client[] = [];
  projects: Project[] = [];
  statuses = Object.values(AppointmentStatus);
  statusLabels = AppointmentStatusLabels;
  selectedClient: Client | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment?: Appointment; preselectedDate?: string; preselectedProject?: Project }
  ) {
    this.appointmentForm = this.fb.group({
      appointmentDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      notes: [''],
      location: [''],
      status: [AppointmentStatus.SCHEDULED, [Validators.required]],
      clientId: ['', [Validators.required]],
      projectId: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProjects();
    
    if (this.data?.appointment) {
      this.isEditMode = true;
      this.title = 'Edit Appointment';
      this.appointmentForm.patchValue({
        ...this.data.appointment,
        appointmentDate: this.data.appointment.appointmentDate ? new Date(this.data.appointment.appointmentDate) : null
      });
      // Set selected client for editing
      if (this.data.appointment?.clientId) {
        this.selectedClient = this.clients.find(client => client.id === this.data.appointment?.clientId) || null;
      }
    } else if (this.data?.preselectedDate) {
      this.appointmentForm.patchValue({
        appointmentDate: new Date(this.data.preselectedDate)
      });
    } else if (this.data?.preselectedProject) {
      this.title = `Schedule Appointment for ${this.data.preselectedProject.name}`;
      this.appointmentForm.patchValue({
        clientId: this.data.preselectedProject.clientId,
        projectId: this.data.preselectedProject.id
      });
      // Set selected client for preselected project
      this.selectedClient = this.clients.find(client => client.id === this.data.preselectedProject?.clientId) || null;
    }
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        // Set selected client after clients are loaded
        if (this.data?.appointment?.clientId) {
          this.selectedClient = this.clients.find(client => client.id === this.data.appointment?.clientId) || null;
        } else if (this.data?.preselectedProject?.clientId) {
          this.selectedClient = this.clients.find(client => client.id === this.data.preselectedProject?.clientId) || null;
        }
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  onClientChange(): void {
    const clientId = this.appointmentForm.get('clientId')?.value;
    if (clientId) {
      // Find the selected client
      this.selectedClient = this.clients.find(client => client.id === clientId) || null;
      
      // Filter projects by selected client
      this.projectService.getProjectsByClientId(clientId).subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          console.error('Error loading client projects:', error);
        }
      });
    } else {
      this.selectedClient = null;
    }
  }

  useClientAddress(): void {
    if (this.selectedClient?.address) {
      this.appointmentForm.patchValue({
        location: this.selectedClient.address
      });
    }
  }

  clearLocation(): void {
    this.appointmentForm.patchValue({
      location: ''
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const appointmentData: AppointmentFormModel = {
        ...formValue,
        appointmentDate: formValue.appointmentDate ? formValue.appointmentDate.toISOString().split('T')[0] : null
      };
      
      if (this.isEditMode && this.data.appointment?.id) {
        this.appointmentService.updateAppointment(this.data.appointment.id, appointmentData).subscribe({
          next: (appointment) => {
            this.dialogRef.close(appointment);
          },
          error: (error) => {
            console.error('Error updating appointment:', error);
          }
        });
      } else {
        this.appointmentService.createAppointment(appointmentData).subscribe({
          next: (appointment) => {
            this.dialogRef.close(appointment);
          },
          error: (error) => {
            console.error('Error creating appointment:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.appointmentForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    }
    return '';
  }
}
