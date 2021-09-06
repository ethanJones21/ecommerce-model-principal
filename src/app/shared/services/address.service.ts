import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}
  getCities() {
    return this.http
      .get<any[]>('assets/data/distritos.json')
      .pipe(map((cities) => cities.sort((a, b) => a.modelo - b.modelo)));
  }
  getProvinces(province_id: string) {
    return this.http
      .get<any[]>('assets/data/provincias.json')
      .pipe(
        map((provincias) =>
          provincias.find((provincia) => provincia.id === province_id)
        )
      );
  }
  getRegions(department_id: string) {
    return this.http
      .get<any[]>('assets/data/regiones.json')
      .pipe(
        map((regions) => regions.find((region) => region.id === department_id))
      );
  }
}
