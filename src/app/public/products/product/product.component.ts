import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductItf } from '../models/product.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { environment } from '../../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
declare const tns: any;
declare const lightGallery: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  socket = io(apiUrl);
  product!: ProductItf;
  // product$!: Observable<any>;
  slug = '';
  subs = new Subscription();
  colors: string[] = [];
  sizes: string[] = [];

  addedToCart = false;

  constructor(
    private productServ: ProductService,
    private route: ActivatedRoute,
    private cartServ: CartService
  ) {}

  ngOnInit(): void {
    this.initProduct();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
    this.route.params.subscribe(({ slug }) => {
      this.slug = slug;
      this.getProduct();
      setTimeout(() => {
        this.initSliderProduct();
        this.initLightGallery();
      }, 500);
    });
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
      this.productServ.getProduct(this.slug).subscribe((product) => {
        this.colors = this.getUnits(product, 'color');
        this.sizes = this.getUnits(product, 'size');
        this.product = product;
        this.btnDisabled();
      })
    );
  }

  getImg(img: string) {
    return this.productServ.getImg(img);
  }

  getUnits(product: ProductItf, title: string) {
    const indice =
      product.varieties?.findIndex((variety) => variety.title === title) || 0;
    return product.varieties[indice].units;
  }

  btnDisabled() {
    if (this.cartServ.pIDs.includes(this.product.id)) this.addedToCart = true;
  }

  addProductToCart(product: ProductItf) {
    const varieties = [{}];
    const amount = 1;
    this.cartServ
      .addProductToCart(product, varieties, amount)
      .subscribe(({ ok, msg, cart }) => {
        this.cartServ.cartID = cart.id;
        this.socket.emit('addProductToCart', cart);
      });
  }
}
