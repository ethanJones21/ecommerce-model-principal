import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ImgService {
  constructor() {}

  getImg(img: string) {
    return `${apiUrl}/uploads/products/${img}`;
  }
}
