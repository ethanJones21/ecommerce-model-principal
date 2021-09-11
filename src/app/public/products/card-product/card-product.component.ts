import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ProductsService } from '../products.service';
import { Observable, of, Subscription } from 'rxjs';
import { ProductItf } from '../models/product.interface';
import { Router } from '@angular/router';
import { FiltersService } from '../../../shared/services/filters.service';

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

  subs = new Subscription();

  products$!: Observable<ProductItf[]>;
  filteredProducts$ = this.filtersServ.filteredProducts.asObservable();

  @Input('colors') colors: string[] = [];
  @Input('otherVarieties') otherVarieties: string[] = [];
  @Input('product') product!: any;

  constructor(
    private productsServ: ProductsService,
    private router: Router,
    private filtersServ: FiltersService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getImg(img: string) {
    return this.productsServ.getImg(img);
  }

  goToProductDetail(slug: string) {
    this.router.navigate(['/products/detail/', slug]);
  }
}
