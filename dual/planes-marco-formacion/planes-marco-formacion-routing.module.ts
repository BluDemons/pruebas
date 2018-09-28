import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//importamos el componente 
import { PlanesMarcoFormacionComponent } from './planes-marco-formacion.component';

const routes: Routes = [
   { path: '', component: PlanesMarcoFormacionComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class PlanesMarcoFormacionRoutingModule { }
