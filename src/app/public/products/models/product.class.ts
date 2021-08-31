import { FormGroup } from '@angular/forms';
export class ProductClass {
  // necessary
  name: string;
  //   galery: any[];
  price: number;
  description: string;
  content: string;
  stock: number;
  category: number;
  varieties?: any[];
  //   ?
  cover?: string;
  slug?: string;
  state?: string;
  active?: boolean;

  constructor(form: FormGroup) {
    const {
      nameProduct: name,
      priceProduct: price,
      descriptionProduct: description,
      contentProduct: content,
      stockProduct: stock,
      categoryProduct: category,
      ...other
    } = form.value;
    //   necessary
    this.name = name;
    this.price = price;
    this.description = description;
    this.content = content;
    this.stock = stock;
    this.category = category;
    // ?
    this.fillOtherFields(other);
  }

  fillOtherFields(other: any) {
    const { activeClient: active } = other;
    this.active = active || true;
  }
}
