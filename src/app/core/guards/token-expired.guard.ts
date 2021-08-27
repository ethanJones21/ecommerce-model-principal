import { Injectable } from '@angular/core';
import { TokenExpiredService } from '../services/token-expired.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenExpiredGuard implements CanActivate, CanActivateChild {
  constructor(private tokenExp: TokenExpiredService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.tokenExp.isTokenExpired();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}
