import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ShippingMethodsService {
  constructor(private http: HttpClient) {}
  getDelivery() {
    return this.http
      .get<{ ok: boolean; delivery: any }>(`${apiUrl}/configs/delivery`)
      .pipe(map(({ delivery }) => delivery));
  }
}
