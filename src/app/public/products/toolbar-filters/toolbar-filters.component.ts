import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SORTS } from '../../../shared/models/sorts.model';

@Component({
  selector: 'Toolbar-filters',
  templateUrl: './toolbar-filters.component.html',
  styleUrls: ['./toolbar-filters.component.scss'],
})
export class ToolbarFiltersComponent implements OnInit {
  @Input() pagination!: { pages: number[]; next: number; limit: number };

  @Output() page = new EventEmitter<number>();
  @Output() limit = new EventEmitter<number>();
  @Output() sort = new EventEmitter<string>();

  limits = [1, 2, 5, 10, 20, 50];
  sorts = SORTS;

  constructor() {}

  ngOnInit(): void {}

  setPage(page: number) {
    this.page.emit(page);
  }

  setLimit(value: string) {
    this.limit.emit(Number(value));
  }

  setSort(property: string) {
    this.sort.emit(property);
  }
}
