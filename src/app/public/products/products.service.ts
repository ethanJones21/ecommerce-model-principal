import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../ecommerce-model/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  getProductsItf,
  onlyProductsInfoItf,
} from './models/product-api.interfaces';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(
    term: any,
    page: number,
    limit: number
  ): Observable<onlyProductsInfoItf> {
    return this.http
      .get<getProductsItf>(
        `${apiUrl}/products/paginado?term=${term}&page=${page}&limit=${limit}`
      )
      .pipe(map(({ ok, products }) => products));
  }

  getImg(img: string) {
    return `${apiUrl}/uploads/products/${img}`;
  }
}
