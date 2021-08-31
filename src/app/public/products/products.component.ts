import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductItf } from './models/product.interface';
import { Router } from '@angular/router';
import { FiltersService } from '../../shared/services/filters.service';

@Component({
  selector: 'Products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  pagination = {
    pages: [1],
    next: 2,
    limit: 2,
  };
  page = 1;
  colors: string[] = [];
  sizes: string[] = [];

  products$!: Observable<ProductItf[]>;
  filteredProducts$ = this.filtersServ.filteredProducts.asObservable();

  constructor(
    private productsServ: ProductsService,
    private router: Router,
    private filtersServ: FiltersService
  ) {}
  ngOnInit() {
    this.getProducts('', this.page, this.pagination.limit);
    this.filteredProducts$.subscribe(
      (products) => (this.products$ = of(products))
    );
  }

  getImg(img: string) {
    return this.productsServ.getImg(img);
  }

  getProducts(term: any, page: number, limit: number) {
    if (page || page != null) {
      this.products$ = this.productsServ.getProducts(term, page, limit).pipe(
        map(({ pages, next, products }) => {
          this.pagination.pages = pages;
          this.pagination.next = next?.page || null;
          products.forEach((product) => {
            this.colors = this.getUnits(product, 'color');
            this.sizes = this.getUnits(product, 'size');
          });
          this.filtersServ.setData(products);
          return products;
        })
      );
    }
  }

  goToProductDetail(slug: string) {
    this.router.navigate(['/products/detail/', slug]);
  }

  getUnits(product: ProductItf, title: string) {
    const indice =
      product.varieties?.findIndex((variety) => variety.title === title) || 0;
    return product.varieties[indice].units;
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
