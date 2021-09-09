import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor() {}
  reset(form: FormGroup) {
    form.reset({
      nameAddressCheck: '',
      lastnameAddressCheck: '',
      emailAddressCheck: '',
      phoneAddressCheck: '',
      zipAddressCheck: 0,
      addressCheck: '',
      deliveryAddressCheck: 5,
      countryAddressCheck: '',
      cityAddressCheck: '',
      noteAddressCheck: '',
      couponCheck: '',
    });
  }
}
