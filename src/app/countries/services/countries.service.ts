import { Injectable } from '@angular/core';
import { Country, Region, smallCountry } from '../interfaces/country.interfaces';
import { map, Observable, of, tap } from 'rxjs';
//Para usar este HttpClient, tenemos que declararlo en los providers del app.module.ts asi "providers: [provideHttpClient()],"
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';
  private _regions: Region[] = [Region.Africa, Region.America, Region.Asia, Region.Europe, Region.Oceania ];

  constructor(
    private http: HttpClient
  ) { }

  get regions(): Region[] {
    return [...this._regions]
  }

  getCountriesByRegion( region: Region ): Observable<smallCountry[]> {
    if( !region ) return of([]);

    const url: string = `${ this.baseUrl }/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url)
      .pipe(
        //Este segundo map es el de javascript, es diferente al map de inicio de linea que es de rxjs
        map( countries => countries.map( country => ({
            name: country.name.common,
            cca3: country.cca3,
            borders: country.borders ?? []
            //Con este operador evaluamos si este campo llega null entonces lo reemplazamos por un objeto vacío []. Hay otro validador que es || pero este toma un string vacío como un valor válido y retorna ese string y no un []
          })
        )
      ),
      tap( response =>console.log({ response })
        ),
      )
  }

  getCountryByAlphaCode( alphaCode: string ): Observable<smallCountry>{

    const url: string = `${ this.baseUrl }/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<Country>(url)
      .pipe(
          map( country => ({
            name: country.name.common,
            cca3: country.cca3,
            borders: country.borders ?? []
          }))
      )

  }

}
