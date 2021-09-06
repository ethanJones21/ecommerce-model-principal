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

  @ViewChild('paypalButton', { static: true }) paypalElement!: ElementRef;

  constructor(
    private cartServ: CartService,
    private addressServ: AddressService,
    private imgServ: ImgService,
    private fb: FormBuilder,
    private shipServ: ShippingMethodsService
  ) {
    this.initForm();
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
      zipAddressCheck: [20000, Validators.required],
      addressCheck: ['', Validators.required],
      deliveryAddressCheck: ['', Validators.required],
      countryAddressCheck: ['', Validators.required],
      cityAddressCheck: ['', Validators.required],
      notesAddressCheck: [''],
    });
  }

  submitForm(form: FormGroup) {
    console.log(form);
    if (form.invalid) {
      return Object.values(form.controls).forEach((control: any) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) => {
            control.markAsTouched();
            // this.productServ.reset(form);
          });
        } else {
          control.markAsTouched();
          // this.productServ.reset(form);
        }
      });
    } else {
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
                description: 'Nombre del pago',
                amount: {
                  currency_code: 'USD',
                  value: 9,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          // this.valueCC.setTransaction = order.purchase_units[0].payments.capture[0].id;
        },
        onError: (err: any) => {},
        onCancel: (data: any, actions: any) => {},
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
        });
      });
    }
  }

  deleteProductOfCart(productID: string) {
    this.cartServ
      .deleteProductOfCart(this.cartServ.cartID, productID)
      .subscribe((resp) => {
        this.socket.emit('deleteProductOfCart', productID);
        this.saveAmountsLocalStorage();
      });
  }

  changeAmount(amount: string, price: number, i: number) {
    this.amounts[i] = Number(amount);
    this.substotal[i] = price * this.amounts[i];
    this.cartServ.changeAmount(this.amounts[i], this.substotal[i], i);
    this.saveAmountsLocalStorage();
  }

  saveAmountsLocalStorage() {
    localStorage.setItem('amounts', JSON.stringify(this.amounts));
  }

  calculateSubTotal() {
    let suma = 0;
    for (let i = 0; i < this.substotal.length; i++) {
      suma += this.substotal[i];
    }
    return suma;
  }

  calculateTotal() {
    // + this.valueCC.deliveryAddressCheck
    return this.calculateSubTotal() + this.igv;
  }

  getImg(img: string) {
    return this.imgServ.getImg(img);
  }
}
