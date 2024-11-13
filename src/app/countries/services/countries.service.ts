import { Injectable } from '@angular/core';
import { Country, Region, smallCountry } from '../interfaces/country.interfaces';
import { Observable, of, tap } from 'rxjs';
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

    return this.http.get<smallCountry[]>(url)
      .pipe(
        tap( response => console.log({ response }))
      );
  }

}
