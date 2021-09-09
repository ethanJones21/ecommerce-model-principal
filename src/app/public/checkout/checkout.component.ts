import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;
import { io } from 'socket.io-client';
import { ImgService } from 'src/app/shared/services/img.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressService } from '../../shared/services/address.service';
import { ShippingMethodsService } from 'src/app/shared/services/shippingMethods.service';
import { Observable } from 'rxjs';
import { formValueControlsCheckout } from './helpers/form-value-controls-checkout.class';
import { formValidControlsCheckout } from './helpers/form-valid-controls-checkout.class';
import { formErrorsControlsCheckout } from './helpers/form-errors-controls-checkout.class';
import { SaleClass } from './models/sale.class';
import { ventaItf, detailsItf } from './models/sale.interfaces';
import { UserService } from '../../shared/services/user.service';
import { CheckoutService } from './checkout.service';
import { RoutesService } from '../../shared/services/routes.service';
import { Router } from '@angular/router';
declare let Cleave: any;
declare let StickySidebar: any;
declare let paypal: any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'Checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  delivery$!: Observable<any[]>;
  cities$!: Observable<any[]>;
  valueCC!: formValueControlsCheckout;
  validCC!: formValidControlsCheckout;
  errorsCC!: formErrorsControlsCheckout;

  socket = io(apiUrl);
  igv = 10;
  cart: any;
  amounts: number[] = [];
  substotal: number[] = [];
  amount_subtotal$ = this.cartServ.amount_subtotal.asObservable();
  checkoutForm!: FormGroup;
  delivery: any[] = [];
  details: detailsItf[] = [];

  existUser = false;
  isPaypal = false;

  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef;

  venta: ventaItf;

  constructor(
    private userServ: UserService,
    private checkServ: CheckoutService,
    private cartServ: CartService,
    private addressServ: AddressService,
    private imgServ: ImgService,
    private fb: FormBuilder,
    private shipServ: ShippingMethodsService,
    private routesServ: RoutesService,
    private router: Router
  ) {
    this.initForm();
    this.venta = new SaleClass(this.checkoutForm, []);
  }

  ngOnInit(): void {
    this.getCart();
    this.socket.on('newCart', this.getCart.bind(this));
    this.socket.on('deleteProduct', this.getCart.bind(this));
    this.amount_subtotal$.subscribe(({ amount, subtotal, i }) => {
      if (amount && subtotal) {
        this.amounts[i] = amount;
        this.substotal[i] = subtotal;
      }
    });
    this.initValidPayCard();
    this.initPaypal();
    this.getCities();
    this.getDelivery();
    this.beRegisteredOrLogin();
  }

  beRegisteredOrLogin() {
    const user = this.userServ.getTokenInformation().user;
    if (user) this.existUser = true;
    this.valueCC.nameAddressCheck = user.name;
    this.valueCC.emailAddressCheck = user.email;
    this.valueCC.lastnameAddressCheck = user.lastname;
  }

  private initControls() {
    this.valueCC = new formValueControlsCheckout(this.checkoutForm);
    this.validCC = new formValidControlsCheckout(this.checkoutForm);
    this.errorsCC = new formErrorsControlsCheckout(this.checkoutForm);
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      nameAddressCheck: ['', Validators.required],
      lastnameAddressCheck: ['', Validators.required],
      emailAddressCheck: ['', Validators.required],
      phoneAddressCheck: ['', Validators.required],
      zipAddressCheck: [0, Validators.required],
      addressCheck: ['', Validators.required],
      deliveryAddressCheck: [5, Validators.required],
      countryAddressCheck: ['', Validators.required],
      cityAddressCheck: ['', Validators.required],
      noteAddressCheck: [''],
      couponCheck: [''],
    });
    this.initControls();
  }

  submitForm(form: FormGroup, total?: number, transaction?: string) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control: any) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) => {
            control.markAsTouched();
            this.checkServ.reset(form);
          });
        } else {
          control.markAsTouched();
          this.checkServ.reset(form);
        }
      });
    } else {
      this.venta = new SaleClass(form, this.details, total, transaction);
    }
  }

  getDelivery() {
    this.delivery$ = this.shipServ.getDelivery();
  }
  getCities() {
    this.cities$ = this.addressServ.getCities();
  }

  initValidPayCard() {
    new Cleave('#cc-number', {
      creditCard: true,
      onCreditCardTypeChanged: (type: any) => {
        // update UI ...
      },
    });
    new Cleave('#cc-exp-date', {
      date: true,
      datePattern: ['m', 'y'],
    });
    const sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
  }

  initPaypal() {
    paypal
      .Buttons({
        style: {
          layout: 'horizontal',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Carrito',
                amount: {
                  currency_code: 'USD',
                  value: this.calculateTotal(),
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          this.submitForm(
            this.checkoutForm,
            this.calculateTotal(),
            order.purchase_units[0].payments.captures[0].id
          );
        },
        onError: (err: any) => {
          console.log(err);
        },
        onCancel: (data: any, actions: any) => {
          console.log(data);
        },
      })
      .render(this.paypalElement.nativeElement);
  }

  getCart() {
    if (this.cartServ.cartID != '123') {
      this.cartServ.getCart(this.cartServ.cartID).subscribe((cart) => {
        this.cart = cart;
        this.cart.products.forEach((p: any, i: number) => {
          const am: any = JSON.parse(localStorage.getItem('amounts') || '[]');
          if (am && am.length > 0) {
            this.amounts = am;
            this.substotal[i] = p.product.price * this.amounts[i];
          } else {
            this.amounts[i] = p.amount;
            this.substotal[i] = p.product.price * p.amount;
          }
          this.calculateSubTotal();
          this.details.push({
            product: p.product._id,
            subtotal: this.substotal[i],
            amount: this.amounts[i],
            variety: p.varieties,
          });
        });
      });
    }
  }

  deleteProductOfCart(productID: string, i: number) {
    this.cartServ
      .deleteProductOfCart(this.cartServ.cartID, productID)
      .subscribe((resp) => {
        this.socket.emit('deleteProductOfCart', productID);
        this.deleteAmount(i);
      });
  }

  changeAmount(amount: string, price: number, i: number) {
    this.amounts[i] = Number(amount);
    this.substotal[i] = price * this.amounts[i];
    this.cartServ.changeAmount(this.amounts[i], this.substotal[i], i);
    this.cartServ.saveAmountsLocalStorage(this.amounts);
  }

  deleteAmount(i: number) {
    // this.amounts[i] = 0;
    this.amounts.splice(i, 1);
    this.substotal[i] = 0;
    this.cartServ.saveAmountsLocalStorage(this.amounts);
  }

  calculateSubTotal() {
    let suma = 0;
    for (let i = 0; i < this.substotal.length; i++) {
      suma += this.substotal[i];
    }
    return suma;
  }

  calculateTotal() {
    return (
      this.calculateSubTotal() + this.igv + this.valueCC.deliveryAddressCheck
    );
  }

  getImg(img: string) {
    return this.imgServ.getImg(img);
  }

  goToRegister() {
    this.routesServ.routerBack = '/checkout';
    this.router.navigateByUrl('/auth/register');
  }
}

// TODO: ver si aplico metodos de pago en ventas osea si es paypal o tarjeta ara ver estadisticas
