import { FormGroup } from '@angular/forms';
export class formErrorsControlsSignIn {
  constructor(private form: FormGroup) {}

  get emailLoginForm() {
    const email = this.form.get('emailLoginForm')?.errors || {};
    return this.setErrorCondition(email, 'correo');
  }
  get passLoginForm() {
    const pass = this.form.get('passLoginForm')?.errors || {};
    return this.setErrorCondition(pass, 'contraseña');
  }

  private setErrorCondition(obj: any, campo: string) {
    const reqLength =
      obj?.minlength?.requiredLength || obj?.maxlength?.requiredLength || '';
    const condition = Object.keys(obj)[0];
    const ERRORS: any = {
      required: 'Este campo es requerido',
      minlength: `Este campo tiene un tamaño minimo de ${reqLength}`,
      maxlength: `Este campo tiene un tamaño maximo de ${reqLength}`,
      pattern: `Coloque un(a) ${campo} valido(a)`,
    };
    return ERRORS[condition];
  }
}
