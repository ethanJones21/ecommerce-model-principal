import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { SignUpService } from './sign-up.service';
import { ValidatorsService } from '../../shared/services/validators.service';
import { catchError } from 'rxjs/operators';
import { RoutesService } from '../../shared/services/routes.service';
import { AlertsService } from '../../shared/services/alerts.service';
import { formValueControlsSignUp } from './helpers/form-value-controls-sign-up.class';
import { formValidControlsSignUp } from './helpers/form-valid-controls-sign-up.class';
import { formErrorsControlsSignUp } from './helpers/form-errors-controls-sign-up.class';

@Component({
  selector: 'Sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  registerForm!: FormGroup;
  routeRedirect = '';
  subs = new Subscription();

  valueCC!: formValueControlsSignUp;
  validCC!: formValidControlsSignUp;
  errorsCC!: formErrorsControlsSignUp;

  constructor(
    private valServ: ValidatorsService,
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthService,
    private signUpServ: SignUpService,
    private routesServ: RoutesService,
    private alertsServ: AlertsService,
    private render: Renderer2
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
    this.valueCC = new formValueControlsSignUp(this.registerForm);
    this.validCC = new formValidControlsSignUp(this.registerForm);
    this.errorsCC = new formErrorsControlsSignUp(this.registerForm);
  }

  initForm() {
    this.registerForm = this.fb.group(
      {
        nameRegisterForm: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z_ ]*$'),
            Validators.minLength(5),
          ],
        ],
        lastnameRegisterForm: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z_ ]*$'),
            Validators.minLength(5),
          ],
        ],
        emailRegisterForm: [
          '',
          [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          ],
          // CustomValidator.emailDisponible(this.afs)
        ],
        passRegisterForm: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('[A-Za-z0-9_]{8,18}'),
          ],
        ],
        passRepeatRegisterForm: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('[A-Za-z0-9_]{8,18}'),
          ],
        ],
      },
      {
        validators: this.valServ.passwordsEquals(
          'passRegisterForm',
          'passRepeatRegisterForm'
        ),
      }
    );
    this.initControls();
  }

  reset() {
    this.registerForm.reset({
      nameRegisterForm: '',
      lastnameRegisterForm: '',
      emailRegisterForm: '',
      passRegisterForm: '',
      passRepeatregisterForm: '',
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
        name: form.controls['nameRegisterForm'].value,
        lastname: form.controls['lastnameRegisterForm'].value,
        email: form.controls['emailRegisterForm'].value,
        password: form.controls['passRegisterForm'].value,
      };
      this.subs.add(
        this.signUpServ
          .register(user)
          .pipe(
            catchError((err: any) => {
              const message = err.error.msg;
              this.alertsServ.showError(message, 'Login');
              return throwError(err.error.msg);
            })
          )
          .subscribe(({ profile, token }) => {
            this.authServ.saveToken(token);
            this.register();
          })
      );
    }
  }

  register() {
    this.authServ.login();
    this.router.navigateByUrl(this.routesServ.routerBack);
  }
}

// export class CustomValidator {
//   static emailDisponible(afs: AngularFirestore) {
//     return (control: FormControl) => {
//       const emailReg = control.value;
//       return afs.collection('users', ref => ref.where('email', '==', emailReg) )
//         .valueChanges().pipe(
//           debounceTime(500),
//           take(1),
//           map(arr => arr.length ? { emailAvailable: false } : null )
//         )
//     }
//   }

// }
