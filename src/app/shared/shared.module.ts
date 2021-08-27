import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { SkeletonTableLoadComponent } from './components/skeleton-table-load/skeleton-table-load.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    LoadingComponent,
    SkeletonTableLoadComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule],
  exports: [LoadingComponent, SkeletonTableLoadComponent, PaginationComponent],
})
export class SharedModule {}
