import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;
import { ProductItf } from '../../public/products/models/product.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartID = '';
  constructor(private http: HttpClient) {}

  getCart() {
    return this.http
      .get<any>(`${apiUrl}/cart`)
      .pipe(map(({ ok, cart }) => cart));
  }

  deleteProductOfCart(cartId: string, productId: string) {
    return this.http.delete(`${apiUrl}/cart/${cartId}/${productId}`);
  }

  addProductToCart(product: ProductItf, varieties: any[], amount: number) {
    let addProduct: any = { products: [] };
    addProduct.products.push({
      product: product.id,
      amount,
      varieties,
      subtotal: product.price * amount,
    });
    return this.http.put<any>(`${apiUrl}/cart/${product.id}`, addProduct);
  }
}
