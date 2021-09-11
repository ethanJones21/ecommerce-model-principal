import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MegaMenuService {
  filtro = 'polos';
  filtroSub = new Subject<string>();
  constructor() {}
  sendCategory(category: string) {
    this.filtro = category;
    this.filtroSub.next(category);
  }
}
