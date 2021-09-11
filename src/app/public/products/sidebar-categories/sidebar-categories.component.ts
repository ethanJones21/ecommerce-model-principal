import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { Observable } from 'rxjs';
import { MegaMenuService } from 'src/app/shared/services/megamenu.service';

@Component({
  selector: 'Sidebar-categories',
  templateUrl: './sidebar-categories.component.html',
  styleUrls: ['./sidebar-categories.component.scss'],
})
export class SidebarCategoriesComponent implements OnInit {
  categories$!: Observable<any[]>;
  @Output() categ = new EventEmitter<string>();

  categNavbar$ = this.megamenuServ.filtroSub.asObservable();
  categNavbar = this.megamenuServ.filtro;

  constructor(
    private categsServ: CategoriesService,
    private megamenuServ: MegaMenuService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.categNavbar$.subscribe((categ) => {
      this.categNavbar = categ;
      this.setCategory(categ);
    });
  }

  // defaultChecked(categories: any, indiceCateg: number) {
  //   let cs: any[] = [];
  //   cs.fill(false, categories.length);
  //   if (this.categNavbar != '') {
  //     categories.forEach((category: any, i: number) => {
  //       if (category.name === this.categNavbar) {
  //         cs[i] = true;
  //       }
  //     });
  //     return cs[indiceCateg];
  //   }
  // }

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
