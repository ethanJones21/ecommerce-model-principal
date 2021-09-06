import { FormGroup } from '@angular/forms';
export class formValidControlsProduct {
  constructor(private form: FormGroup) {}

  get colorSelected() {
    const color = this.form.get('colorSelected');
    return color?.invalid && color?.touched && color?.dirty;
  }
  get otherVarietySelected() {
    const variety = this.form.get('otherVarietySelected');
    return variety?.invalid && variety?.touched && variety?.dirty;
  }
  get amountSelected() {
    const amount = this.form.get('amountSelected');
    return amount?.invalid && amount?.touched && amount?.dirty;
  }
}
