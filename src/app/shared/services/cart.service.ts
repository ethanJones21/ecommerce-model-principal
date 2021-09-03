import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;
import { ProductItf } from '../../public/products/models/product.interface';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  pIDs: string[] = [];
  amount_subtotal = new Subject<{
    amount: number;
    subtotal: number;
    i: number;
  }>();

  cartID = '';
  constructor(private http: HttpClient) {}

  getProductsLength() {
    return this.http.get<any>(`${apiUrl}/cart`).pipe(
      map(({ ok, cart }) => {
        cart[0].products.forEach((p: any) => {
          this.pIDs.push(p.product._id);
        });
        return cart[0].products.length;
      })
    );
  }

  getCart() {
    return this.http
      .get<any>(`${apiUrl}/cart`)
      .pipe(map(({ ok, cart }) => cart[0]));
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

  changeAmount(amount: number, subtotal: number, i: number) {
    this.amount_subtotal.next({ amount, subtotal, i });
  }
}
