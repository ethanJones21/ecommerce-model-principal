import { FormGroup } from '@angular/forms';
export class formValueControlsCheckout {
  constructor(private form: FormGroup) {}

  get deliveryAddressCheck() {
    const delivery = this.form.get('deliveryAddressCheck');
    return delivery?.value;
  }
}
