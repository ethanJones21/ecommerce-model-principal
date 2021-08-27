import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'Skeleton-table-load',
  templateUrl: './skeleton-table-load.component.html',
  styleUrls: ['./skeleton-table-load.component.scss'],
})
export class SkeletonTableLoadComponent implements OnInit {
  @Input('limit') limit!: Observable<[]>;
  clients = new Array(this.limit);

  constructor() {}

  ngOnInit(): void {}
}
