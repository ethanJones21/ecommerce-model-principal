import { FormGroup } from '@angular/forms';
export class formValueControlsSignUp {
  constructor(private form: FormGroup) {}

  get passRegisterForm() {
    const pass = this.form.get('passRegisterForm');
    return pass?.value;
  }
  get passRepeatRegisterForm() {
    const pass = this.form.get('passRepeatRegisterForm');
    return pass?.value;
  }
}
