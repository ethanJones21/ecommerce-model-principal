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

  cartID = '123';
  constructor(private http: HttpClient) {
    this.initCartID();
  }

  private initCartID() {
    const cid = localStorage.getItem('cartID');
    if (cid) this.cartID = cid;
  }

  getProductsLength(cartID: string) {
    return this.http.get<any>(`${apiUrl}/cart/${cartID}`).pipe(
      map(({ ok, cart }) => {
        cart.products.forEach((p: any) => {
          this.pIDs.push(p.product._id);
        });
        return cart.products.length;
      })
    );
  }

  getCart(cartID: string) {
    return this.http
      .get<any>(`${apiUrl}/cart/${cartID}`)
      .pipe(map(({ ok, cart }) => cart));
  }

  deleteProductOfCart(cartId: string, productId: string) {
    return this.http.delete(`${apiUrl}/cart/${cartId}/${productId}`);
  }

  saveCartID(cartID: string) {
    localStorage.setItem('cartID', cartID);
  }

  addProductToCart(product: ProductItf, varieties: any[], amount: number) {
    let addProduct: any = { products: [] };
    addProduct.products.push({
      product: product.id,
      amount,
      varieties,
      subtotal: product.price * amount,
    });
    return this.http.put<any>(
      `${apiUrl}/cart/${this.cartID}/${product.id}`,
      addProduct
    );
  }

  changeAmount(amount: number, subtotal: number, i: number) {
    this.amount_subtotal.next({ amount, subtotal, i });
  }
}
