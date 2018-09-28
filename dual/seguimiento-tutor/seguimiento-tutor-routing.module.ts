import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguimientoTutorComponent } from './seguimiento-tutor.component';

const routes: Routes = [
   { path: '', component: SeguimientoTutorComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class SeguimientoTutorRoutingModule{ }
