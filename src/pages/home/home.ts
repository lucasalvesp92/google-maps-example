import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HomeProvider } from '../../providers/home/home';
import { Address } from '../../model/address.model';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public form: FormGroup;
  @ViewChild('map') mapElement: ElementRef;
  esconderList: boolean;
  origem: string;
  listOrigem: Array<Address>;
  destino: string;
  listDestino: Array<Address>;
  latitude: number;
  longitude: number;
  map: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  GoogleAutocomplete = new google.maps.places.AutocompleteService();

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private homeProvider: HomeProvider,
    private formBuilder: FormBuilder) {
    this.buildForm();
      

  }

  ionViewDidLoad(){
    this.onChangeOrigem();
    this.onChangeDestino();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = (resp.coords.latitude) ? resp.coords.latitude : null;
      this.longitude = (resp.coords.longitude) ? resp.coords.longitude : null;
      this.initMap(this.latitude, this.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
  }

  initMap(latitude: number, longitude: number) {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: {lat: latitude, lng: longitude}
    });

    this.directionsDisplay.setMap(this.map);
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.form.get('origem').value,
      destination: this.form.get('destino').value,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  buildForm(): void {
    this.form = this.formBuilder
      .group({
        origem: [null, null],
        destino: [null, null]
      });
  }

  onChangeOrigem(): void {
    this.form.get('origem').valueChanges.debounceTime(500).subscribe((value) => {
      this.updateSearchResultsOrigem(value, this.listOrigem);
    });
  }

  onChangeDestino(): void {
    this.form.get('destino').valueChanges.debounceTime(500).subscribe((value) => {
      this.updateSearchResultsDestino(value, this.listDestino);
    });
  }

  updateSearchResultsOrigem(address: string, list:Array<Address>):void {
    this.listOrigem = [];
    if (address == '') {
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: address },
    (predictions, status) => {
      if(predictions) {
        const verificaSelecao = predictions.find((item) => item.description === address);
        this.listOrigem = [];
        if (verificaSelecao === undefined) {
          predictions.forEach((prediction) => {
            this.listOrigem.push(prediction);
          });
        }
      }
    });
  }

  updateSearchResultsDestino(address: string, list:Array<Address>): Array<any>{
    this.listDestino = [];
    if (address == '') {
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: address },
    (predictions, status) => {
      if(predictions) {
        const verificaSelecao = predictions.find((item) => item.description === address);
        this.listDestino = [];
        if (verificaSelecao === undefined) {
          predictions.forEach((prediction) => {
            this.listDestino.push(prediction);
          });
        }
        return this.listDestino;
      }
    });
  }

  selectOrigem(address: string): void {
    this.form.get('origem').setValue(address['description']);
    this.listOrigem = [];
  }

  selectDestino(address: string): void {
    this.form.get('destino').setValue(address['description']);
    this.listDestino = [];
  }
  

}