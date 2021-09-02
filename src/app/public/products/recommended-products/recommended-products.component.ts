import { Component, OnInit } from '@angular/core';
declare const tns: any;
@Component({
  selector: 'Recommended-products',
  templateUrl: './recommended-products.component.html',
  styleUrls: ['./recommended-products.component.scss'],
})
export class RecommendedProductsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.initSliderRecommendedProducts();
  }

  initSliderRecommendedProducts() {
    tns({
      container: '.cs-carousel-inner-two',
      controlsText: [
        '<i class="cxi-arrow-left"></i>',
        '<i class="cxi-arrow-right"></i>',
      ],
      navPosition: 'top',
      controlsPosition: 'top',
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      nav: false,
      controlsContainer: '#custom-controls-related',
      responsive: {
        0: {
          items: 1,
          gutter: 20,
        },
        480: {
          items: 2,
          gutter: 24,
        },
        700: {
          items: 3,
          gutter: 24,
        },
        1100: {
          items: 4,
          gutter: 30,
        },
      },
    });
  }
}
