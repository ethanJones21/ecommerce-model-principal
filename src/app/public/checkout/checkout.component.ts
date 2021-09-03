import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
import { ImgService } from 'src/app/shared/services/img.service';
declare let Cleave: any;
declare let StickySidebar: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  socket = io(apiUrl);
  cart: any;
  amounts: number[] = [];
  substotal: number[] = [];
  amount_subtotal$ = this.cartServ.amount_subtotal.asObservable();

  // va en configs
  shippingCost = 10;
  salesTax = 5; //igv

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
    this.initValidPayCard();
  }

  initValidPayCard() {
    new Cleave('#cc-number', {
      creditCard: true,
      onCreditCardTypeChanged: (type: any) => {
        // update UI ...
      },
    });
    new Cleave('#cc-exp-date', {
      date: true,
      datePattern: ['m', 'y'],
    });
    const sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
  }

  getCart() {
    this.cartServ.getCart().subscribe((cart) => {
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
        this.calculateSubTotal();
      });
    });
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

  saveAmountsLocalStorage() {
    localStorage.setItem('amounts', JSON.stringify(this.amounts));
  }

  calculateSubTotal() {
    let suma = 0;
    for (let i = 0; i < this.substotal.length; i++) {
      suma += this.substotal[i];
    }
    return suma;
  }

  calculateTotal() {
    return this.calculateSubTotal() + this.shippingCost + this.salesTax;
  }

  getImg(img: string) {
    return this.imgServ.getImg(img);
  }
}
