import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenExpiredService {
  private helper = new JwtHelperService();
  private token = this.authServ.getToken();

  constructor(private authServ: AuthService) {}

  isTokenExpired(): boolean {
    const isExpired = this.helper.isTokenExpired(this.token);
    return !isExpired;
  }
}
