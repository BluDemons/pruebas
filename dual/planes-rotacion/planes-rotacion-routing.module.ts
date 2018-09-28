import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanesRotacionComponent } from './planes-rotacion.component';

const routes: Routes = [
   { path: '', component: PlanesRotacionComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class PlanesRotacionRoutingModule { }
