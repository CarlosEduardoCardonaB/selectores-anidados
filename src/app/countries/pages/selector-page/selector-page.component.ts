import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
   ){}

  ngOnInit(): void {
   this.onRegionChange();
  }

   get regions(): Region[]{
    return this.countriesService.regions;
   }


   public onRegionChange(): void{
    this.myForm.get('region')!.valueChanges
    .pipe(
      //El switchMap me permite recibir el valor de un observable y subscribirme a otro observable
      switchMap( region => this.countriesService.getCountriesByRegion(region))
      //esto de aqui arriba es igual a esto: "switchMap(this.countriesService.getCountriesByRegion)" donde se da por obvio que estamos enviando la region
    )
    .subscribe( region => {
      //Aqui estamos obteniendo el valor seleccionado en el select "region"
      console.log({region})
    })
   }



}
