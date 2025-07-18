import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment';
import { Appointment, AppointmentStatus, AppointmentStatusLabels } from '../../models/appointment.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form';

@Component({
  selector: 'app-schedule-view',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule
  ],
  templateUrl: './schedule-view.html',
  styleUrl: './schedule-view.scss'
})
export class ScheduleViewComponent implements OnInit {
  todaysAppointments: Appointment[] = [];
  selectedDateAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  selectedDate: Date = new Date();
  loading = false;
  statusLabels = AppointmentStatusLabels;
  currentWeekStart = new Date();
  weekDays: {name: string, date: Date}[] = [];
  weekAppointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeWeek();
    this.loadTodaysAppointments();
    this.loadUpcomingAppointments();
    this.loadSelectedDateAppointments();
    this.loadWeekAppointments();
  }

  loadTodaysAppointments(): void {
    this.loading = true;
    this.appointmentService.getTodaysAppointments().subscribe({
      next: (appointments) => {
        this.todaysAppointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading today\'s appointments:', error);
        this.loading = false;
        this.snackBar.open('Error loading appointments', 'Close', { duration: 3000 });
      }
    });
  }

  loadUpcomingAppointments(): void {
    this.appointmentService.getUpcomingAppointments().subscribe({
      next: (appointments) => {
        this.upcomingAppointments = appointments.slice(0, 10); // Show next 10 appointments
      },
      error: (error) => {
        console.error('Error loading upcoming appointments:', error);
      }
    });
  }

  loadSelectedDateAppointments(): void {
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.appointmentService.getAppointmentsByDate(dateStr).subscribe({
      next: (appointments) => {
        this.selectedDateAppointments = appointments;
      },
      error: (error) => {
        console.error('Error loading selected date appointments:', error);
      }
    });
  }

  onDateChange(): void {
    this.loadSelectedDateAppointments();
  }

  openAppointmentForm(appointment?: Appointment, preselectedDate?: string): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { appointment, preselectedDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTodaysAppointments();
        this.loadUpcomingAppointments();
        this.loadSelectedDateAppointments();
        this.loadWeekAppointments();
        this.snackBar.open(
          appointment ? 'Appointment updated successfully' : 'Appointment scheduled successfully',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    if (appointment.id && confirm(`Are you sure you want to delete this appointment with ${appointment.clientName}?`)) {
      this.appointmentService.deleteAppointment(appointment.id).subscribe({
        next: () => {
          this.loadTodaysAppointments();
          this.loadUpcomingAppointments();
          this.loadSelectedDateAppointments();
          this.loadWeekAppointments();
          this.snackBar.open('Appointment deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.snackBar.open('Error deleting appointment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  markAsCompleted(appointment: Appointment): void {
    if (appointment.id) {
      const updatedAppointment = {
        ...appointment,
        status: AppointmentStatus.COMPLETED,
        appointmentDate: appointment.appointmentDate
      };
      
      this.appointmentService.updateAppointment(appointment.id, updatedAppointment).subscribe({
        next: () => {
          this.loadTodaysAppointments();
          this.loadUpcomingAppointments();
          this.loadSelectedDateAppointments();
          this.loadWeekAppointments();
          this.snackBar.open('Appointment marked as completed', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          this.snackBar.open('Error updating appointment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusColor(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'primary';
      case AppointmentStatus.IN_PROGRESS:
        return 'accent';
      case AppointmentStatus.COMPLETED:
        return 'success';
      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.NO_SHOW:
        return 'warn';
      default:
        return '';
    }
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  isToday(dateString: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  }

  scheduleForSelectedDate(): void {
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.openAppointmentForm(undefined, dateStr);
  }

  // Week View Methods
  initializeWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    this.currentWeekStart = startOfWeek;
    this.generateWeekDays();
  }

  generateWeekDays(): void {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.weekDays = days.map((name, index) => {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + index);
      return { name, date };
    });
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekDays();
    this.loadWeekAppointments();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
    this.loadWeekAppointments();
  }

  getWeekRange(): string {
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(this.currentWeekStart.getDate() + 6);
    return `${this.formatDate(this.currentWeekStart.toISOString())} - ${this.formatDate(endDate.toISOString())}`;
  }

  loadWeekAppointments(): void {
    const startDate = this.currentWeekStart.toISOString().split('T')[0];
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(this.currentWeekStart.getDate() + 6);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // For now, fall back to getting all appointments if the range endpoint doesn't exist
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        // Filter appointments to the current week
        this.weekAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= this.currentWeekStart && aptDate <= endDate;
        });
      },
      error: (error) => {
        console.error('Error loading week appointments:', error);
        this.weekAppointments = [];
      }
    });
  }

  getAppointmentsForDay(date: Date): Appointment[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.weekAppointments.filter(apt => apt.appointmentDate === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getAppointmentClass(appointment: Appointment): string {
    const baseClass = 'appointment-slot';
    const statusClass = appointment.status.toLowerCase();
    return `${baseClass} ${statusClass}`;
  }

  scheduleForDay(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    this.openAppointmentForm(undefined, dateStr);
  }
}
