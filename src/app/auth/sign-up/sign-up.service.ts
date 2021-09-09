import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ClientApi, ClientForm } from '../../core/models/auth.model';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private http: HttpClient) {}

  register(client: ClientForm): Observable<ClientApi> {
    return this.http.post<ClientApi>(`${apiUrl}/auth/register`, client);
  }
}
