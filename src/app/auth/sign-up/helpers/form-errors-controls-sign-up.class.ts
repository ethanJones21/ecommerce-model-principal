import { FormGroup } from '@angular/forms';
export class formErrorsControlsSignUp {
  constructor(private form: FormGroup) {}

  get nameRegisterForm() {
    const name = this.form.get('nameRegisterForm')?.errors || {};
    return this.setErrorCondition(name, 'nombre');
  }
  get lastnameRegisterForm() {
    const lastname = this.form.get('lastnameRegisterForm')?.errors || {};
    return this.setErrorCondition(lastname, 'apellido');
  }
  get emailRegisterForm() {
    const email = this.form.get('emailRegisterForm')?.errors || {};
    return this.setErrorCondition(email, 'correo');
  }
  get passRegisterForm() {
    const pass = this.form.get('passRegisterForm')?.errors || {};
    return this.setErrorCondition(pass, 'contraseña');
  }
  get passRepeatRegisterForm() {
    const passRepeat = this.form.get('passRepeatRegisterForm')?.errors || {};
    return this.setErrorCondition(passRepeat, 'contraseña');
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
      noEsIgual: `Las contraseñas no son iguales`,
    };
    return ERRORS[condition];
  }
}
