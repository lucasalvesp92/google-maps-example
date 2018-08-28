import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Address } from '../../model/address.model'
/*
  Generated class for the HomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HomeProvider {

  constructor(public http: HttpClient) {
    console.log('Hello HomeProvider Provider');
  }

  searchAddress(address: String): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
      })
    };
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${address}&types=geocode&language=pt_BR&key=AIzaSyBQLqkvdlBk_vPiIVzYbZfSPfpnyl2yAmw`
    let listAddress: Array<Address>;
    return this.http.get(url, httpOptions);
  }

}
