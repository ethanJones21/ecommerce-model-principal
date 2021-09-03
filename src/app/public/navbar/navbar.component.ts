import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'Navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  countProducts = 0;
  viewCart = false;
  constructor(private cartServ: CartService) {}

  ngOnInit(): void {
    this.cartServ
      .getProductsLength()
      .subscribe((count) => (this.countProducts = count));
  }

  closeModal(close: boolean) {
    this.viewCart = close;
  }
}
