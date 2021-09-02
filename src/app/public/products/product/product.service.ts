import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProduct(slug: string): Observable<any> {
    return this.http
      .get<any>(`${apiUrl}/products/${slug}`)
      .pipe(map(({ ok, product }) => product));
  }

  getImg(img: string) {
    return `${apiUrl}/uploads/products/${img}`;
  }
}
