import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectForm, ProjectStatus } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  getProjectsByClientId(clientId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/client/${clientId}`);
  }

  getProjectsByStatus(status: ProjectStatus): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/status/${status}`);
  }

  searchProjects(name: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/search?name=${name}`);
  }

  createProject(project: ProjectForm): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }

  updateProject(id: number, project: ProjectForm): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
