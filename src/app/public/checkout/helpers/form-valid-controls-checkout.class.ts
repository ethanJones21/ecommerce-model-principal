import { FormGroup } from '@angular/forms';
export class formValidControlsCheckout {
  constructor(private form: FormGroup) {}

  get deliveryAddressCheck() {
    const delivery = this.form.get('deliveryAddressCheck');
    return delivery?.invalid && delivery?.touched && delivery?.dirty;
  }
}
