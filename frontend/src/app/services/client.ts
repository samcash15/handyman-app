import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientForm } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  searchClients(name: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search?name=${name}`);
  }

  createClient(client: ClientForm): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }

  updateClient(id: number, client: ClientForm): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
