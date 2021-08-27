import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './products/product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { NouisliderModule } from 'ng2-nouislider';

@NgModule({
  declarations: [
    NavbarComponent,
    PublicComponent,
    HomeComponent,
    FooterComponent,
    ProductsComponent,
    ProductComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    NouisliderModule,
  ],
  exports: [NavbarComponent, PublicComponent, HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicModule {}
