import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignInService } from './sign-in.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { catchError } from 'rxjs/operators';
import { AlertsService } from '../../shared/services/alerts.service';
import { formValueControlsSignIn } from './helpers/form-value-controls-sign-in.class';
import { formValidControlsSignIn } from './helpers/form-valid-controls-sign-in.class';
import { formErrorsControlsSignIn } from './helpers/form-errors-controls-sign-in.class';

@Component({
  selector: 'Sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  routeRedirect = '';
  subs = new Subscription();
  rememberBool = true;

  valueCC!: formValueControlsSignIn;
  validCC!: formValidControlsSignIn;
  errorsCC!: formErrorsControlsSignIn;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthService,
    private signInServ: SignInService,
    private routesServ: RoutesService,
    private alertsServ: AlertsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  seePass(v: any) {
    if (v.type == 'password') {
      v.type = 'text';
    } else {
      v.type = 'password';
    }
  }

  private initControls() {
    this.valueCC = new formValueControlsSignIn(this.loginForm);
    this.validCC = new formValidControlsSignIn(this.loginForm);
    this.errorsCC = new formErrorsControlsSignIn(this.loginForm);
  }

  initForm() {
    this.loginForm = this.fb.group({
      emailLoginForm: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      passLoginForm: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('[A-Za-z0-9_]{8,18}'),
        ],
      ],
    });
    this.initControls();
  }

  submitForm(form: FormGroup) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control: any) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) => {
            control.markAsTouched();
            this.signInServ.reset(this.loginForm);
          });
        } else {
          control.markAsTouched();
          this.signInServ.reset(this.loginForm);
        }
      });
    } else {
      const user = {
        email: form.controls['emailLoginForm'].value,
        password: form.controls['passLoginForm'].value,
      };
      this.rememberMe();
      this.subs.add(
        this.signInServ
          .login(user)
          .pipe(
            catchError((err: any) => {
              const message = err.error.msg;
              this.alertsServ.showError(message, 'Login');
              return throwError(err.error.msg);
            })
          )
          .subscribe(({ profile, token }) => {
            this.authServ.saveToken(token);
            this.login();
          })
      );
    }
  }

  rememberMe() {
    if (this.rememberBool) {
      localStorage.setItem(
        'email',
        this.loginForm.controls['emailLoginForm'].value
      );
    }
  }

  login() {
    this.authServ.login();
    this.router.navigateByUrl(this.routesServ.routerBack);
    // this.routeRedirect = this.authServ.urlUsuarioIntentaAcceder;
    // console.log(this.routeRedirect);
    // this.authServ.urlUsuarioIntentaAcceder = '';
    // TODO: RESOLVER QUE NO PASA NINGUNA RUTA
    // this.router.navigate([this.routeRedirect]);
  }
}
