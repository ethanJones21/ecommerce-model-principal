import { FormGroup } from '@angular/forms';
export class formValidControlsSignUp {
  constructor(private form: FormGroup) {}

  get nameRegisterForm() {
    const name = this.form.get('nameRegisterForm');
    return name?.invalid && name?.touched && name?.dirty;
  }
  get lastnameRegisterForm() {
    const lastname = this.form.get('lastnameRegisterForm');
    return lastname?.invalid && lastname?.touched && lastname?.dirty;
  }
  get emailRegisterForm() {
    const email = this.form.get('emailRegisterForm');
    return email?.invalid && email?.touched && email?.dirty;
  }
  get passRegisterForm() {
    const pass = this.form.get('passRegisterForm');
    return pass?.invalid && pass?.touched && pass?.dirty;
  }
  get passRepeatRegisterForm() {
    const passRepeat = this.form.get('passRepeatRegisterForm');
    return passRepeat?.invalid && passRepeat?.touched && passRepeat?.dirty;
  }

  get passEquals() {
    const pass1 = this.form.get('passRegisterForm')?.value;
    const pass2 = this.form.get('passRepeatRegisterForm')?.value;
    return pass1 === pass2 ? false : true;
  }
}
