import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'Products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm() {
    this.productForm = this.fb.group({ single: [10] });
  }
}
