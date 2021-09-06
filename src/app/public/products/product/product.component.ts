import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductItf } from '../models/product.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { environment } from '../../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
import { AlertsService } from '../../../shared/services/alerts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formValueControlsProduct } from './helpers/form-value-controls-product.class';
import { formValidControlsProduct } from './helpers/form-valid-controls-product.class';
import { formErrorsControlsProduct } from './helpers/form-errors-controls-product.class';
declare const tns: any;
declare const lightGallery: any;
@Component({
  selector: 'Product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  socket = io(apiUrl);

  valueCC!: formValueControlsProduct;
  validCC!: formValidControlsProduct;
  errorsCC!: formErrorsControlsProduct;

  product!: ProductItf;
  amount = 1;
  // product$!: Observable<any>;
  slug = '';
  subs = new Subscription();
  colors: string[] = [];
  otherVariety: string[] = [];
  titleOtherVariety = '';

  addedToCart = false;

  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productServ: ProductService,
    private route: ActivatedRoute,
    private cartServ: CartService,
    private alertsServ: AlertsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initProduct();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initForm() {
    this.productForm = this.fb.group({
      colorSelected: [''],
      otherVarietySelected: ['', Validators.required],
      amountSelected: [1, Validators.required],
    });
    this.initControls();
  }

  private initControls() {
    this.valueCC = new formValueControlsProduct(this.productForm);
    this.validCC = new formValidControlsProduct(this.productForm);
    this.errorsCC = new formErrorsControlsProduct(this.productForm);
  }

  initProduct() {
    this.product = {
      id: '',
      name: '',
      slug: '',
      stars: 0,
      cover: '',
      price: 0,
      description: '',
      content: '',
      stock: 0,
      varieties: [],
      category: '',
      galery: [
        {
          id: '1',
          name: 'default.jpg',
        },
      ],
    };
    this.route.params.subscribe(
      ({ slug }) => {
        this.slug = slug;
        this.getProduct();
        setTimeout(() => {
          this.initSliderProduct();
          this.initLightGallery();
        }, 500);
      },
      (err) => this.alertsServ.showError(err, 'No se pudo obtener el producto')
    );
  }

  initSliderProduct() {
    tns({
      container: '.cs-carousel-inner',
      controlsText: [
        '<i class="cxi-arrow-left"></i>',
        '<i class="cxi-arrow-right"></i>',
      ],
      navPosition: 'top',
      controlsPosition: 'top',
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      navContainer: '#cs-thumbnails',
      navAsThumbnails: true,
      gutter: 15,
    });
  }

  initLightGallery() {
    const e = document.querySelectorAll('.cs-gallery');
    if (e.length) {
      for (let t = 0; t < e.length; t++) {
        lightGallery(e[t], {
          selector: '.cs-gallery-item',
          download: !1,
          videojs: !0,
          youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 },
          vimeoPlayerParams: { byline: 0, portrait: 0 },
        });
      }
    }
  }

  getProduct() {
    this.subs.add(
      this.productServ.getProduct(this.slug).subscribe(
        (product) => {
          this.colors = this.getUnits(product, 'color');
          this.otherVariety = this.getUnits(product, 'other');
          this.product = product;
          this.btnDisabled();
        },
        (err) =>
          this.alertsServ.showError(err, 'No se pudo obtener el producto')
      )
    );
  }

  getImg(img: string) {
    return this.productServ.getImg(img);
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

  btnDisabled() {
    if (this.cartServ.pIDs.includes(this.product.id)) this.addedToCart = true;
  }

  addProductToCart(form: FormGroup, product: ProductItf) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control: any) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) => {
            control.markAsTouched();
            this.productServ.reset(form);
          });
        } else {
          control.markAsTouched();
          this.productServ.reset(form);
        }
      });
    } else {
      const v: any = {};
      const varieties: any[] = [];
      v[this.titleOtherVariety] = this.valueCC.otherVarietySelected;
      if (this.colors.length > 0) v.color = this.valueCC.colorSelected;
      varieties.push(v);
      this.cartServ
        .addProductToCart(product, varieties, this.valueCC.amountSelected)
        .subscribe(
          ({ ok, msg, cart }) => {
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
}
