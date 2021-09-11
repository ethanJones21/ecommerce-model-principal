import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProductComponent } from './card-product/card-product.component';
import { ProductComponent } from '../products/product/product.component';
import { RecommendedProductsComponent } from './recommended-products/recommended-products.component';
import { SearchProductsComponent } from './search-products/search-products.component';
import { ProductsComponent } from '../products/products.component';
import { SharedModule } from '../../shared/shared.module';
import { ToolbarFiltersComponent } from './toolbar-filters/toolbar-filters.component';
import { SidebarCategoriesComponent } from './sidebar-categories/sidebar-categories.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewsComponent } from './product/reviews/reviews.component';

@NgModule({
  declarations: [
    ProductsComponent,
    CardProductComponent,
    ProductComponent,
    RecommendedProductsComponent,
    SearchProductsComponent,
    SidebarCategoriesComponent,
    ToolbarFiltersComponent,
    ReviewsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [
    ProductsComponent,
    CardProductComponent,
    ProductComponent,
    RecommendedProductsComponent,
    SearchProductsComponent,
    SidebarCategoriesComponent,
    ToolbarFiltersComponent,
    ReviewsComponent,
  ],
})
export class ProductsModule {}
