import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../shared/services/address.service';

@Component({
  selector: 'Address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  cities: any[] = [];
  constructor(private addressServ: AddressService) {}

  ngOnInit(): void {
    this.addressServ.getCities().subscribe((cities) => (this.cities = cities));
  }
}
