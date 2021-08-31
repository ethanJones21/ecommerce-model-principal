import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}
  getCategories() {
    return this.http
      .get<{ ok: boolean; categories: any[] }>(`${apiUrl}/configs/categories`)
      .pipe(map(({ categories }) => categories));
  }
}
