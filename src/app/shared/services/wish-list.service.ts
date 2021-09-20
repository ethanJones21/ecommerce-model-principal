import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  constructor(private http: HttpClient) {}
  getWishList() {
    return this.http
      .get<{ ok: boolean; wishlist: any }>(`${apiUrl}/wishlist`)
      .pipe(map(({ ok, wishlist }) => wishlist));
  }
  addProductToWishList(id: string) {
    let products = [];
    products.push(id);
    return this.http.put<any>(`${apiUrl}/wishlist`, products);
  }

  getWishListProductsLength() {
    return this.http.get<any>(`${apiUrl}/wishlist`).pipe(
      map(({ ok, wishlist }) => {
        return wishlist.products.length;
      })
    );
  }
}
