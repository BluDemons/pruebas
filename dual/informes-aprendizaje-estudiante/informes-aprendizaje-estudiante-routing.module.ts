import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesAprendizajeEstudianteComponent } from './informes-aprendizaje-estudiante.component';

const routes: Routes = [
   { path: '', component: InformesAprendizajeEstudianteComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class InformesAprendizajeEstudianteRoutingModule { }
