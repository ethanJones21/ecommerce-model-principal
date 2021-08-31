import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'Sidebar-categories',
  templateUrl: './sidebar-categories.component.html',
  styleUrls: ['./sidebar-categories.component.scss'],
})
export class SidebarCategoriesComponent implements OnInit {
  categories$!: Observable<any[]>;
  @Output() categ = new EventEmitter<string>();
  constructor(private categsServ: CategoriesService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categories$ = this.categsServ.getCategories();
  }

  setCategory(category: string) {
    // const myCheckbox = document.getElementsByName('myCheckbox');
    // Array.prototype.forEach.call(myCheckbox, (el) => {
    //   el.checked = false;
    // });
    // check.checked = true;
    this.categ.emit(category);
  }

  searchCategory(term: string) {
    this.setCategory(term);
  }
}
