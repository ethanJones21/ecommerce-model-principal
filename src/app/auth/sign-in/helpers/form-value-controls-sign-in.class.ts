import { FormGroup } from '@angular/forms';
export class formValueControlsSignIn {
  constructor(private form: FormGroup) {}

  get passLoginForm() {
    const pass = this.form.get('passLoginForm');
    return pass?.value;
  }
}
