import { FormGroup } from '@angular/forms';
export class formErrorsControlsProduct {
  constructor(private form: FormGroup) {}

  get colorSelected() {
    const colorSelected = this.form.get('colorSelected')?.errors || {};
    return this.setErrorCondition(colorSelected, 'color');
  }
  get otherVarietySelected() {
    const otherVarietySelected =
      this.form.get('otherVarietySelected')?.errors || {};
    return this.setErrorCondition(otherVarietySelected, 'variedad');
  }
  get amountSelected() {
    const amountSelected = this.form.get('amountSelected')?.errors || {};
    return this.setErrorCondition(amountSelected, 'cantidad');
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
