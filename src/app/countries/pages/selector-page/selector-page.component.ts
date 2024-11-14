import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, smallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: smallCountry[] = [];
  public borders: string[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
   ){}

   //Este ngOnInit debe estar después de la declaración de myForm para que encuentre el campo que estamos buscando, en este caso el select 'region'
   //En este caso el ngOnInit funciona como listener escuchando lo que seleccionamos en el select 'region'S
  ngOnInit(): void {
   this.onRegionChange();
   this.onCountryChanged();
  }

   get regions(): Region[]{
    return this.countriesService.regions;
   }


   public onRegionChange(): void{
    //En este punto validamos la selección que haga el usuario en el select de region (continente) y lanzamos el servicio para consultar esa región
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('') ),
      tap( () => this.borders = [] ),
      //El switchMap me permite recibir el valor de un observable y subscribirme a otro observable
      switchMap( region => this.countriesService.getCountriesByRegion(region))
      //esto de aqui arriba es igual a esto: "switchMap(this.countriesService.getCountriesByRegion)" donde se da por obvio que estamos enviando la region
    )
    .subscribe( countries => {
      //Aqui estamos obteniendo el valor seleccionado en el select "region"
      this.countriesByRegion = countries.sort((a1, a2) => a1.name.localeCompare(a2.name)); //Con sort ordenamos alfabéticamente por el nombre

      //console.log({countries})
    })
   }

   onCountryChanged(): void{
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('border')!.setValue('') ),
        filter( (value: string) => value.length > 0 ),  //En este punto validamos si no hay alphaCode del país seleccionado. Aqui si se cumple la condición devuelve un true y si no un false. si es un false ahi finaliza la ejecución y no sige al switchMap
        switchMap( alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode))
      )
      .subscribe( country => {
        //console.log({borders: country.borders});
        this.borders = country.borders!;
      })
   }




}
