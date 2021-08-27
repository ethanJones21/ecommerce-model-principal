import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignInService } from './sign-in.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'Sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  routeRedirect = '';
  subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthService,
    private signInServ: SignInService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initForm() {
    this.loginForm = this.fb.group({
      emailLoginForm: ['', Validators.required],
      passLoginForm: ['', Validators.required],
    });
  }

  reset() {
    this.loginForm.reset({
      emailLoginForm: '',
      passLoginForm: '',
    });
  }

  submitForm(form: FormGroup) {
    if (form.invalid) {
      return Object.values(form.controls).forEach((control: any) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) => {
            control.markAsTouched();
            this.reset();
          });
        } else {
          control.markAsTouched();
          this.reset();
        }
      });
    } else {
      const user = {
        email: form.controls['emailLoginForm'].value,
        password: form.controls['passLoginForm'].value,
      };
      this.subs.add(
        this.signInServ.login(user).subscribe(({ profile, token }) => {
          this.authServ.saveToken(token);
          this.login();
        })
      );
    }
  }

  login() {
    this.authServ.login();
    this.router.navigate(['/panel']);
    // this.routeRedirect = this.authServ.urlUsuarioIntentaAcceder;
    // console.log(this.routeRedirect);
    // this.authServ.urlUsuarioIntentaAcceder = '';
    // TODO: RESOLVER QUE NO PASA NINGUNA RUTA
    // this.router.navigate([this.routeRedirect]);
  }
}
