import { FormGroup } from '@angular/forms';
export class formValueControlsProduct {
  constructor(private form: FormGroup) {}

  get colorSelected() {
    const color = this.form.get('colorSelected');
    return color?.value;
  }
  get otherVarietySelected() {
    const variety = this.form.get('otherVarietySelected');
    return variety?.value;
  }
  get amountSelected() {
    const amount = this.form.get('amountSelected');
    return amount?.value;
  }
}
