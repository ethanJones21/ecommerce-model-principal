import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roleAs = '';
  private helper = new JwtHelperService();
  private token = this.authServ.getToken();

  constructor(private authServ: AuthService) {
    this.decodeToken();
  }

  decodeToken() {
    const { role } = this.helper.decodeToken(this.token);
    this.roleAs = role;
  }

  getRole(): string {
    return this.roleAs;
  }
}
