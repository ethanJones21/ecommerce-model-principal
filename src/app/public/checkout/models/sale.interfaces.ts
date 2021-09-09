export interface detailsItf {
  product: string;
  subtotal: number;
  amount: number;
  variety: any[];
  client?: string; //id
  sale?: string;
}
export interface ventaItf {
  delivery: any;
  coupon: string;
  state: string;
  phone: string;
  address: any;
  details: detailsItf[] | any[];
  transaction: string;
  total: number;
  client?: string;
  nsale?: string;
  note?: string;
}
