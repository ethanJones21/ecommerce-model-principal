import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserApi, UserForm } from '../../core/models/auth.model';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(private http: HttpClient) {}

  login(user: UserForm): Observable<UserApi> {
    return this.http.post<UserApi>(`${apiUrl}/auth-user/login`, user);
  }
}
