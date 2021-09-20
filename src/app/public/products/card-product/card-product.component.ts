import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ProductsService } from '../products.service';
import { Observable, of, Subscription } from 'rxjs';
import { ProductItf } from '../models/product.interface';
import { Router } from '@angular/router';
import { FiltersService } from '../../../shared/services/filters.service';
import { WishListService } from '../../../shared/services/wish-list.service';
import { AlertsService } from '../../../shared/services/alerts.service';
import { environment } from '../../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';

@Component({
  selector: 'Card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
})
export class CardProductComponent implements OnInit, OnDestroy {
  pagination = {
    pages: [1],
    next: 2,
    limit: 2,
  };
  page = 1;
  socket = io(apiUrl);
  subs = new Subscription();
  // activeWish = false;

  products$!: Observable<ProductItf[]>;
  filteredProducts$ = this.filtersServ.filteredProducts.asObservable();

  @Input('colors') colors: string[] = [];
  @Input('otherVarieties') otherVarieties: string[] = [];
  @Input('product') product!: any;

  activeWish = false;

  constructor(
    private productsServ: ProductsService,
    private router: Router,
    private filtersServ: FiltersService,
    private wishlistServ: WishListService,
    private alertsServ: AlertsService
  ) {}

  ngOnInit(): void {
    this.activeWish = this.product.wishlist;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getImg(img: string) {
    return this.productsServ.getImg(img);
  }

  goToProductDetail(slug: string) {
    this.router.navigate(['/products/detail/', slug]);
  }

  addProductToWishList(product: ProductItf) {
    this.wishlistServ
      .addProductToWishList(product.id)
      .subscribe(({ ok, msg, wishlist }) => {
        this.alertsServ.showSuccess(msg, 'Lista de deseos');
        this.socket.emit('addProductToWishList', wishlist);
        this.activeWish = true;
      });
  }
}
