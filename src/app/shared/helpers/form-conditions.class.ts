import { Router } from '@angular/router';
export class FormConditions {
  constructor(private router: Router) {}

  submitSuccess(ok: boolean, msg: string, model?: any, route?: string) {
    // Swal.fire({
    //   icon: 'success',
    //   title: 'ok',
    //   text: msg,
    // });
    if (route) this.router.navigate([route]);
  }
}
