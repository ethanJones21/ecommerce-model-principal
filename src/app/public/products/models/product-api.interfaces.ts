import { ProductItf } from './product.interface';

export interface getProductItf {
  ok: boolean;
  product: ProductItf;
}

export interface getProductsItf {
  ok: boolean;
  products: onlyProductsInfoItf;
}
export interface createUpdateProductsItf {
  ok: boolean;
  msg: string;
  product: ProductItf;
}

export interface desactivateProductItf {
  ok: boolean;
  msg: string;
}

export interface onlyProductsInfoItf {
  products: ProductItf[];
  pages: number[];
  longitud: number;
  next: any; //number | {}
  previous: any; //number | {}
}
