import { FormGroup } from '@angular/forms';
export class formValueControlsCheckout {
  constructor(private form: FormGroup) {}

  get deliveryAddressCheck() {
    const delivery = this.form.get('deliveryAddressCheck');
    return delivery?.value;
  }

  set nameAddressCheck(name: string) {
    this.form.get('nameAddressCheck')?.setValue(name);
  }
  set lastnameAddressCheck(lastname: string) {
    this.form.get('lastnameAddressCheck')?.setValue(lastname);
  }
  set emailAddressCheck(email: string) {
    this.form.get('emailAddressCheck')?.setValue(email);
  }
}
