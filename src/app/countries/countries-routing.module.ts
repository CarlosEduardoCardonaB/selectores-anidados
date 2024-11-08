import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';

const routes: Routes = [
  {
    path: '',
    //Aqui podemos hacer de dos maneras, la primera es esta:
    //component: SelectorPageComponent,
    //Y la segunda con children, asi: (Esta sirve si hay más subrutas, por ejemplo http://localhost:4200/selector/subrutaX)
    children: [
      {path: 'selector', component: SelectorPageComponent},
      {path: '**', redirectTo: 'selector'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountriesRoutingModule { }
