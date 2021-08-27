import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user!: any;
  private expirationDate!: Date | null;

  constructor(private auth: AuthService) {}

  getTokenInformation(): { user: {}; expirationDate: Date | null } {
    const token = this.auth.getToken();
    const helper = new JwtHelperService();
    const user = helper.decodeToken(token);
    const expirationDate = helper.getTokenExpirationDate(token);
    return {
      user,
      expirationDate,
    };
  }

  getUser(): any {
    return this.user;
  }

  getExpirationDate(): Date | null {
    return this.expirationDate;
  }
}
