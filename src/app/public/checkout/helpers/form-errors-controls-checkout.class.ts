import { FormGroup } from '@angular/forms';
export class formErrorsControlsCheckout {
  constructor(private form: FormGroup) {}

  get deliveryAddressCheck() {
    const deliveryAddressCheck =
      this.form.get('deliveryAddressCheck')?.errors || {};
    return this.setErrorCondition(deliveryAddressCheck, 'delivery');
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
