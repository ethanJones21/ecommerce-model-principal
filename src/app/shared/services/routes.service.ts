import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter, map, pairwise } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  routerB = '';
  constructor(private router: Router) {}

  get routerBack() {
    return this.routerB;
  }

  set routerBack(r: string) {
    this.routerB = r;
  }

  get previousRoute$() {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    );
  }

  //   Observable<string>
  //   get previousRoute$(): Observable<string> {
  //     return this.router.events.pipe(
  //       filter((e) => e instanceof RoutesRecognized),
  //       //@ts-expect-error
  //       pairwise(),
  //         map((e: [RoutesRecognized, RoutesRecognized]) => e[0].url)
  //     );
  //   }
}
