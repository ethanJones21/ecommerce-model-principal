import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ImgService } from '../../shared/services/img.service';

@Component({
  selector: 'Wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {
  wishlist: any;

  @Output() close = new EventEmitter<boolean>();
  constructor(
    // private wishListServ: WishListService,

    private imgServ: ImgService
  ) {}

  ngOnInit(): void {
    this.getWishList();
  }

  getWishList() {
    // this.wishListServ.getWishList().subscribe((wishlist) =>
    //   this.wishlist = wishlist
    // );
  }

  closeModal() {
    this.close.emit(false);
  }

  getImg(img: string) {
    return this.imgServ.getImg(img);
  }
}
