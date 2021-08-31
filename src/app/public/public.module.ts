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
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './products/product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ToolbarFiltersComponent } from './toolbar-filters/toolbar-filters.component';
import { SidebarCategoriesComponent } from './sidebar-categories/sidebar-categories.component';
import { PrivateModule } from '../private/private.module';

@NgModule({
  declarations: [
    NavbarComponent,
    PublicComponent,
    HomeComponent,
    FooterComponent,
    ProductsComponent,
    ProductComponent,
    CheckoutComponent,
    BreadcrumbComponent,
    ToolbarFiltersComponent,
    SidebarCategoriesComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PrivateModule,
  ],
  exports: [
    NavbarComponent,
    PublicComponent,
    HomeComponent,
    FooterComponent,
    ProductsComponent,
    ProductComponent,
    CheckoutComponent,
    BreadcrumbComponent,
    ToolbarFiltersComponent,
    SidebarCategoriesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicModule {}
