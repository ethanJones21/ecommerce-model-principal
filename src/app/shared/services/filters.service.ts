import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ProductItf } from '../../public/products/models/product.interface';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  filteredProducts = new Subject<ProductItf[]>();
  dataArr: any;
  filters: any = {};
  constructor() {}

  setData(data: any) {
    this.dataArr = data;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts.next(
      _.filter(this.dataArr, _.conforms(this.filters))
    );
  }

  filterExact(property: string, rule: any) {
    this.filters[property] = (val: any) => val == rule;
    this.applyFilters();
  }

  filterSmallerThan(property: string, rule: any) {
    this.filters[property] = (val: any) => val < rule;
    this.applyFilters();
  }

  filterBiggerThan(property: string, rule: any) {
    this.filters[property] = (val: any) => val > rule;
    this.applyFilters();
  }

  removeFilter(property: string) {
    delete this.filters[property];
    // @ts-expect-error
    this[property] = null;
    this.applyFilters();
  }

  removeFilters(arr: string[]) {
    arr.forEach((property) => {
      delete this.filters[property];
      // @ts-expect-error
      this[property] = null;
    });
    this.applyFilters();
  }
}
