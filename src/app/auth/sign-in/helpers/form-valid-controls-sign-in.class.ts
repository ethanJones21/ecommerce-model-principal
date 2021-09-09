import { FormGroup } from '@angular/forms';
export class formValidControlsSignIn {
  constructor(private form: FormGroup) {}

  get emailLoginForm() {
    const email = this.form.get('emailLoginForm');
    return email?.invalid && email?.touched && email?.dirty;
  }
  get passLoginForm() {
    const pass = this.form.get('passLoginForm');
    return pass?.invalid && pass?.touched && pass?.dirty;
  }
}
