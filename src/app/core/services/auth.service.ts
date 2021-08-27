import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly ISTOKEN = 'token';
  readonly ISLOGGEDKEY = 'islogged';
  // public urlUsuarioIntentaAcceder = '';

  loginFirst = 'false';
  tokenFirst = '';

  public changeLoginStatusSubject = new Subject<boolean>();
  public changeLoginStatus$ = this.changeLoginStatusSubject.asObservable();

  constructor() {}

  login() {
    this.loginFirst = 'true';
    localStorage.setItem(this.ISLOGGEDKEY, 'true');
    this.changeLoginStatusSubject.next(true);
  }

  logout() {
    localStorage.removeItem(this.ISLOGGEDKEY);
    this.changeLoginStatusSubject.next(false);
  }

  // TODO: NO SE PORQUE NO FUNCIONA EL URL: STRING
  isLoggedIn(): boolean {
    const isLogged = localStorage.getItem(this.ISLOGGEDKEY) || this.loginFirst;
    return isLogged && isLogged === 'true' ? true : false;
  }

  saveToken(token: string) {
    this.tokenFirst = token;
    localStorage.setItem(this.ISTOKEN, token);
  }

  getToken(): string {
    return localStorage.getItem(this.ISTOKEN) || this.tokenFirst;
  }
}
