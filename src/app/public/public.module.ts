import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PrivateModule } from '../private/private.module';
import { CartComponent } from './cart/cart.component';
import { AddressComponent } from './address/address.component';
import { PipesModule } from '../core/pipes/pipes.module';
import { WishListComponent } from './wish-list/wish-list.component';
import { ProductsModule } from './products/products.module';

@NgModule({
  declarations: [
    NavbarComponent,
    PublicComponent,
    HomeComponent,
    FooterComponent,
    CheckoutComponent,
    BreadcrumbComponent,
    CartComponent,
    AddressComponent,
    WishListComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PrivateModule,
    PipesModule,
    ProductsModule,
  ],
  exports: [
    NavbarComponent,
    PublicComponent,
    HomeComponent,
    FooterComponent,
    CheckoutComponent,
    BreadcrumbComponent,
    CartComponent,
    AddressComponent,
    WishListComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicModule {}
