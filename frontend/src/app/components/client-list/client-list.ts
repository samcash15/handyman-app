import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client';
import { Client } from '../../models/client.model';
import { ClientFormComponent } from '../client-form/client-form';
import { ProjectFormComponent } from '../project-form/project-form';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss'
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  loading = false;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.loading = false;
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.filteredClients = this.clients.filter(client => 
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phone?.includes(this.searchTerm)
      );
    } else {
      this.filteredClients = this.clients;
    }
  }

  openClientForm(client?: Client): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '500px',
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
        if (result.client && result.project) {
          this.snackBar.open('Client and project created successfully', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(
            client ? 'Client updated successfully' : 'Client created successfully',
            'Close',
            { duration: 3000 }
          );
        }
      }
    });
  }

  createProjectForClient(client: Client): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '600px',
      data: { preselectedClient: client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.project && result.appointments) {
          this.snackBar.open(`Project and ${result.appointments.length} appointments created successfully`, 'Close', { duration: 3000 });
        } else if (result.project && result.appointment) {
          this.snackBar.open('Project and appointment created successfully', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
        }
      }
    });
  }

  deleteClient(client: Client): void {
    if (client.id && confirm(`Are you sure you want to delete ${client.name}?`)) {
      this.clientService.deleteClient(client.id).subscribe({
        next: () => {
          this.loadClients();
          this.snackBar.open('Client deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.snackBar.open('Error deleting client', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
