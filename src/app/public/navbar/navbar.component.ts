import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
@Component({
  selector: 'Navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  countProducts = 0;
  viewCart = false;
  socket = io(apiUrl);
  constructor(private cartServ: CartService) {}

  ngOnInit(): void {
    this.getProductsLength();
    this.socket.on('newCart', this.getProductsLength.bind(this));
    this.socket.on('deleteProduct', this.getProductsLength.bind(this));
  }

  getProductsLength() {
    if (this.cartServ.cartID != '123') {
      this.cartServ
        .getProductsLength(this.cartServ.cartID)
        .subscribe((count) => (this.countProducts = count));
    }
  }

  closeModal(close: boolean) {
    this.viewCart = close;
  }
}
