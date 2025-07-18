import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project';
import { Project, ProjectStatus, ProjectStatusLabels } from '../../models/project.model';
import { ProjectFormComponent } from '../project-form/project-form';
import { AppointmentFormComponent } from '../appointment-form/appointment-form';

@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm = '';
  selectedStatus = '';
  loading = false;
  statuses = Object.values(ProjectStatus);
  statusLabels = ProjectStatusLabels;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = projects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
        this.snackBar.open('Error loading projects', 'Close', { duration: 3000 });
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.projects;

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(project => project.status === this.selectedStatus);
    }

    this.filteredProjects = filtered;
  }

  openProjectForm(project?: Project): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '600px',
      data: { project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
        if (result.project && result.appointments) {
          this.snackBar.open(`Project and ${result.appointments.length} appointments created successfully`, 'Close', { duration: 3000 });
        } else if (result.project && result.appointment) {
          this.snackBar.open('Project and appointment created successfully', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(
            project ? 'Project updated successfully' : 'Project created successfully',
            'Close',
            { duration: 3000 }
          );
        }
      }
    });
  }

  scheduleAppointment(project: Project): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '500px',
      data: { preselectedProject: project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Appointment scheduled successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteProject(project: Project): void {
    if (project.id && confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects();
          this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.snackBar.open('Error deleting project', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusColor(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.PENDING:
        return 'warn';
      case ProjectStatus.IN_PROGRESS:
        return 'primary';
      case ProjectStatus.COMPLETED:
        return 'accent';
      case ProjectStatus.CANCELLED:
        return '';
      default:
        return '';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }
}
