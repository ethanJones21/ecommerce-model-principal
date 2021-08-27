import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
  EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { paginationItf } from './interfaces/pagination.interface';

@Component({
  selector: 'Pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnDestroy {
  subs = new Subscription();

  page = 1;
  pagesEl: ElementRef[] = [];
  notPrevPage = false;
  notNextPage = false;

  @ViewChildren('pageModel', { read: ElementRef })
  pageModel!: QueryList<ElementRef>;

  @Input('pagination') pagination!: paginationItf;
  @Output() pageEmitter = new EventEmitter<number>();

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getPagesEl();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private selectedPage(page: number): void {
    //empieza desde cero [0]
    if (this.pagesEl.length > 0) {
      this.renderer.addClass(this.pagesEl[page - 1].nativeElement, 'selected');
    }
  }

  private removeAllSelectedPages(): void {
    if (this.pagesEl.length > 0) {
      this.pagesEl.forEach((val, i) => {
        this.renderer.removeClass(this.pagesEl[i].nativeElement, 'selected');
      });
    }
  }

  private getPagesEl(): void {
    //una sola vez
    this.subs.add(
      this.pageModel.changes.subscribe((paginas) => {
        paginas.forEach(
          (pagina: ElementRef, i: number) => (this.pagesEl[i] = pagina)
        );
        this.selectedPage(1);
      })
    );
  }
  previous() {
    const newPage = this.pagination.previous?.page || this.pagination.previous;
    this.pageEmitter.emit(newPage);
    this.removeAllSelectedPages();
    this.selectedPage(newPage);
  }
  next() {
    const newPage = this.pagination.next?.page || this.pagination.next;
    this.pageEmitter.emit(newPage);
    this.removeAllSelectedPages();
    this.selectedPage(newPage);
  }

  changePage(page: number) {
    this.page = page;
    this.pageEmitter.emit(page);
    this.removeAllSelectedPages();
    this.selectedPage(page);
  }
}
