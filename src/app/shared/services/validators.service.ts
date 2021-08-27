import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  onlyEmail = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$';
  onlyNumber = '[0-9]{1,6}';
  onlyString = '^[a-zA-Z_ ]*$';

  constructor() {}
}
