import { Component, OnInit } from '@angular/core';
import { ProductItf } from '../../../public/products/models/product.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsService } from '../../../public/products/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'Search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss'],
})
export class SearchProductsComponent implements OnInit {
  products$!: Observable<ProductItf[]>;
  term = '';
  constructor(
    private productsServ: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ term }) => {
      this.term = term;
      this.getProducts(term, 1, 20);
    });
  }

  getProducts(term: any, page: number, limit: number) {
    if (page || page != null) {
      this.products$ = this.productsServ
        .getProducts(term, page, limit)
        .pipe(map(({ products }) => products));
    }
  }
}
