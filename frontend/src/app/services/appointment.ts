import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentForm } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl);
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/date/${date}`);
  }

  getTodaysAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/today`);
  }

  getTodaysActiveAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/today/active`);
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/upcoming`);
  }

  getAppointmentsByDateRange(startDate: string, endDate: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/range?start=${startDate}&end=${endDate}`);
  }

  getAppointmentsByClientId(clientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/client/${clientId}`);
  }

  getAppointmentsByProjectId(projectId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/project/${projectId}`);
  }

  createAppointment(appointment: AppointmentForm): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, appointment);
  }

  updateAppointment(id: number, appointment: AppointmentForm): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
