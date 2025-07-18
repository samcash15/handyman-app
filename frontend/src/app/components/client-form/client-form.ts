import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client';
import { ProjectService } from '../../services/project';
import { Client, ClientForm as ClientFormModel } from '../../models/client.model';
import { ProjectStatus, ProjectStatusLabels } from '../../models/project.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-client-form',
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
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  projectForm: FormGroup;
  isEditMode = false;
  title = 'Add New Client';
  createProject = false;
  statuses = Object.values(ProjectStatus);
  statusLabels = ProjectStatusLabels;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client?: Client }
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(500)]]
    });
    
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [ProjectStatus.PENDING, [Validators.required]],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.client) {
      this.isEditMode = true;
      this.title = 'Edit Client';
      this.clientForm.patchValue(this.data.client);
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid && (!this.createProject || this.projectForm.valid)) {
      const clientData: ClientFormModel = this.clientForm.value;
      
      if (this.isEditMode && this.data.client?.id) {
        this.clientService.updateClient(this.data.client.id, clientData).subscribe({
          next: (client) => {
            this.dialogRef.close(client);
          },
          error: (error) => {
            console.error('Error updating client:', error);
          }
        });
      } else {
        this.clientService.createClient(clientData).subscribe({
          next: (client) => {
            if (this.createProject) {
              this.createProjectForClient(client);
            } else {
              this.dialogRef.close(client);
            }
          },
          error: (error) => {
            console.error('Error creating client:', error);
          }
        });
      }
    }
  }

  createProjectForClient(client: Client): void {
    const projectData = {
      ...this.projectForm.value,
      clientId: client.id,
      hourlyRate: 0,
      startDate: this.projectForm.value.startDate ? this.projectForm.value.startDate.toISOString().split('T')[0] : null,
      endDate: this.projectForm.value.endDate ? this.projectForm.value.endDate.toISOString().split('T')[0] : null
    };
    
    this.projectService.createProject(projectData).subscribe({
      next: (project) => {
        this.dialogRef.close({ client, project });
      },
      error: (error) => {
        console.error('Error creating project:', error);
        // Still close with client if project creation fails
        this.dialogRef.close(client);
      }
    });
  }

  onCreateProjectChange(): void {
    if (this.createProject) {
      this.projectForm.reset({
        status: ProjectStatus.PENDING
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.clientForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Invalid email format';
      }
      if (control.errors['maxlength']) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is too long`;
      }
    }
    return '';
  }
}
