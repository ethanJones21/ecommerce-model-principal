import { FormGroup } from '@angular/forms';
import { detailsItf } from './sale.interfaces';
export class SaleClass {
  delivery: any;
  state: string;
  address: any;
  phone: string;
  coupon: string;
  total: number;
  transaction: string;
  details: detailsItf[] | any[];
  client?: string;
  nsale?: string;
  note?: string;
  constructor(
    form: FormGroup,
    details: any[],
    total?: number,
    transaction?: string
  ) {
    const {
      addressCheck,
      cityAddressCheck,
      countryAddressCheck,
      deliveryAddressCheck,
      couponAddressCheck,
      noteAddressCheck,
      phoneAddressCheck,
      zipAddressCheck,
    } = form.value;
    this.details = details;
    this.delivery = deliveryAddressCheck;
    this.coupon = couponAddressCheck || '';
    this.state = 'Procesando';
    this.address = {
      address: addressCheck,
      city: cityAddressCheck,
      country: countryAddressCheck,
      zip: zipAddressCheck,
    };
    this.phone = phoneAddressCheck;
    this.note = noteAddressCheck || '';
    this.total = total || 0;
    this.transaction = transaction || '';
  }
}
