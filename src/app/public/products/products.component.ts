import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductItf } from './models/product.interface';
import { Router } from '@angular/router';
import { FiltersService } from '../../shared/services/filters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';
import { AlertsService } from '../../shared/services/alerts.service';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { formValueControlsProduct } from './product/helpers/form-value-controls-product.class';
import { formValidControlsProduct } from './product/helpers/form-valid-controls-product.class';
import { formErrorsControlsProduct } from './product/helpers/form-errors-controls-product.class';

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
  colors: string[] = [];
  otherVariety: string[] = [];
  titleOtherVariety = '';

  socket = io(apiUrl);

  valueCC!: formValueControlsProduct;
  validCC!: formValidControlsProduct;
  errorsCC!: formErrorsControlsProduct;

  product!: ProductItf;
  amount = 1;

  productsForm!: FormGroup;

  addedToCart = false;
  subs = new Subscription();

  products$!: Observable<ProductItf[]>;
  filteredProducts$ = this.filtersServ.filteredProducts.asObservable();

  constructor(
    private fb: FormBuilder,
    private productsServ: ProductsService,
    private router: Router,
    private filtersServ: FiltersService,
    private cartServ: CartService,
    private alertsServ: AlertsService
  ) {
    this.initForm();
  }
  ngOnInit() {
    this.getProducts('', this.page, this.pagination.limit);
    this.filteredProducts$.subscribe(
      (products) => (this.products$ = of(products))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initForm() {
    this.productsForm = this.fb.group({
      colorSelected: [''],
      otherVarietySelected: ['', Validators.required],
    });
    this.initControls();
  }

  private initControls() {
    this.valueCC = new formValueControlsProduct(this.productsForm);
    this.validCC = new formValidControlsProduct(this.productsForm);
    this.errorsCC = new formErrorsControlsProduct(this.productsForm);
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
            this.otherVariety = this.getUnits(product, 'size');
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
    let indice = 0;
    if (title === 'color') {
      indice =
        product.varieties?.findIndex((variety) => variety.title === title) || 0;
    } else {
      indice =
        product.varieties?.findIndex((variety) => variety.title !== 'color') ||
        0;
      this.titleOtherVariety = product.varieties[indice].title;
    }
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

  btnDisabled() {
    if (this.cartServ.pIDs.includes(this.product.id)) this.addedToCart = true;
  }

  addProductToCart(form: FormGroup, product: ProductItf) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control: any) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) => {
            control.markAsTouched();
            this.productsServ.reset(form);
          });
        } else {
          control.markAsTouched();
          this.productsServ.reset(form);
        }
      });
    } else {
      const v: any = {};
      const varieties: any[] = [];
      v[this.titleOtherVariety] = this.valueCC.otherVarietySelected;
      if (this.colors.length > 0) v.color = this.valueCC.colorSelected;
      varieties.push(v);
      this.cartServ.addProductToCart(product, varieties, this.amount).subscribe(
        ({ ok, msg, cart }) => {
          this.saveAmounts();
          this.alertsServ.showSuccess(msg, 'Carrito');
          this.cartServ.cartID = cart.id;
          this.addedToCart = true;
          this.cartServ.saveCartID(cart.id);
          this.socket.emit('addProductToCart', cart);
        },
        (err) => this.alertsServ.showError(err, 'Carrito')
      );
    }
  }

  saveAmounts() {
    const amounts: number[] = this.cartServ.getAmountsLocalStorage();
    amounts.push(Number(this.amount));
    this.cartServ.saveAmountsLocalStorage(amounts);
  }
}
