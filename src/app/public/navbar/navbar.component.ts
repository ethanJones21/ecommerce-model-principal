import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { CategoriesService } from '../../shared/services/categories.service';
import { map } from 'rxjs/operators';
import { MegaMenuService } from 'src/app/shared/services/megamenu.service';
import { Router } from '@angular/router';
@Component({
  selector: 'Navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  countProducts = 0;
  countWishProducts = 0;
  viewCart = false;
  viewWishList = false;
  socket = io(apiUrl);
  ropas$!: Observable<any>;
  shoes$!: Observable<any>;
  accesories$!: Observable<any>;
  constructor(
    private cartServ: CartService,
    private categServ: CategoriesService,
    private megamenuServ: MegaMenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProductsLength();
    this.socket.on('newCart', this.getProductsLength.bind(this));
    this.socket.on('deleteProduct', this.getProductsLength.bind(this));
    this.getCategories();
  }

  sendCategory(category: string) {
    this.megamenuServ.sendCategory(category);
    this.router.navigateByUrl('/products');
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
    this.viewWishList = close;
  }

  search(term: string) {
    this.router.navigateByUrl(`/search/${term}`);
  }

  getCategories() {
    this.ropas$ = this.categServ.getCategories().pipe(
      map((categories: any) => {
        let ropas: string[] = [];
        categories.forEach((category: any) => {
          if (category.collection === 'ropa') ropas.push(category.name);
        });
        return ropas;
      })
    );
    this.shoes$ = this.categServ.getCategories().pipe(
      map((categories: any) => {
        let zapatos: string[] = [];
        categories.forEach((category: any) => {
          if (category.collection === 'zapatos') zapatos.push(category.name);
        });
        return zapatos;
      })
    );
    this.accesories$ = this.categServ.getCategories().pipe(
      map((categories: any) => {
        let accesorios: string[] = [];
        categories.forEach((category: any) => {
          if (category.collection === 'accesorios')
            accesorios.push(category.name);
        });
        return accesorios;
      })
    );
  }
}
