import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductItf } from './models/product.interface';
import { FiltersService } from '../../shared/services/filters.service';

@Component({
  selector: 'Products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  pagination = {
    pages: [1],
    next: 2,
    limit: 2,
  };
  page = 1;
  subs = new Subscription();

  colors: any[] = [];
  otherVarieties: any[] = [];

  products$!: Observable<ProductItf[]>;
  filteredProducts$ = this.filtersServ.filteredProducts.asObservable();

  constructor(
    private productsServ: ProductsService,
    private filtersServ: FiltersService
  ) {}
  ngOnInit() {
    this.getProducts('', this.page, this.pagination.limit);
    this.filteredProducts$.subscribe(
      (products) => (this.products$ = of(products))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getProducts(term: any, page: number, limit: number) {
    if (page || page != null) {
      this.products$ = this.productsServ.getProducts(term, page, limit).pipe(
        map(({ pages, next, products }) => {
          this.pagination.pages = pages;
          this.pagination.next = next?.page || null;
          products.forEach((product) => {
            product.varieties[0].units.forEach((unit) => {
              this.otherVarieties.push(unit);
            });
            product.varieties[1].units.forEach((unit) => {
              this.colors.push(unit);
            });
          });
          this.filtersServ.setData(products);
          return products;
        })
      );
    }
  }

  sortProducts(property: string) {
    switch (property) {
      case 'popularidad':
        this.removeFilters('stars');
        this.filtersServ.filterBiggerThan('stars', 4);
        break;
      case 'precios bajos':
        this.removeFilters('price');
        this.filtersServ.filterSmallerThan('price', 200);
        break;
      case 'precios altos':
        this.removeFilters('price');
        this.filtersServ.filterBiggerThan('price', 200);
        break;
      case 'puntuacion media':
        this.removeFilters('stars');
        this.filtersServ.filterSmallerThan('stars', 5);
        break;
      default:
        break;
    }
  }

  removeFilters(property: string) {
    const properties = ['stars', 'price'];
    const indice = properties.findIndex((el) => el === property);
    delete properties[indice];
    this.filtersServ.removeFilters(properties);
  }
}
