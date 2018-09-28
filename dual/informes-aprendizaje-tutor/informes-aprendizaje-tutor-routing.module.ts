import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesAprendizajeTutorComponent } from './informes-aprendizaje-tutor.component';

const routes: Routes = [
   { path: '', component: InformesAprendizajeTutorComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class InformesAprendizajeTutorRoutingModule { }
