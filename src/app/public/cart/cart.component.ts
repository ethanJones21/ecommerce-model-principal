import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
import { ImgService } from 'src/app/shared/services/img.service';

@Component({
  selector: 'Cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  socket = io(apiUrl);
  cart: any;
  amounts: number[] = [];
  substotal: number[] = [];
  amount_subtotal$ = this.cartServ.amount_subtotal.asObservable();

  @Output() close = new EventEmitter<boolean>();

  constructor(private cartServ: CartService, private imgServ: ImgService) {}

  ngOnInit(): void {
    this.getCart();
    this.socket.on('newCart', this.getCart.bind(this));
    this.socket.on('deleteProduct', this.getCart.bind(this));
    this.amount_subtotal$.subscribe(({ amount, subtotal, i }) => {
      if (amount && subtotal) {
        this.amounts[i] = amount;
        this.substotal[i] = subtotal;
      }
    });
  }

  getCart() {
    if (this.cartServ.cartID != '123') {
      this.cartServ.getCart(this.cartServ.cartID).subscribe((cart) => {
        this.cart = cart;
        this.cart.products.forEach((p: any, i: number) => {
          const am: any = JSON.parse(localStorage.getItem('amounts') || '[]');
          if (am && am.length > 0) {
            this.amounts = am;
            this.substotal[i] = p.product.price * this.amounts[i];
          } else {
            this.amounts[i] = p.amount;
            this.substotal[i] = p.product.price * p.amount;
          }
          this.calculateTotal();
        });
      });
    }
  }

  closeModal() {
    this.close.emit(false);
  }

  saveAmountsLocalStorage() {
    localStorage.setItem('amounts', JSON.stringify(this.amounts));
  }

  deleteProductOfCart(productID: string) {
    this.cartServ
      .deleteProductOfCart(this.cartServ.cartID, productID)
      .subscribe((resp) => {
        this.socket.emit('deleteProductOfCart', productID);
        this.saveAmountsLocalStorage();
      });
  }

  changeAmount(amount: string, price: number, i: number) {
    this.amounts[i] = Number(amount);
    this.substotal[i] = price * this.amounts[i];
    this.cartServ.changeAmount(this.amounts[i], this.substotal[i], i);
    this.saveAmountsLocalStorage();
  }

  calculateTotal() {
    let suma = 0;
    for (let i = 0; i < this.substotal.length; i++) {
      suma += this.substotal[i];
    }
    return suma;
  }

  getImg(img: string) {
    return this.imgServ.getImg(img);
  }
}
