import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanesProyectoEmpresarialComponent } from './planes-proyecto-empresarial.component';

const routes: Routes = [
   { path: '', component: PlanesProyectoEmpresarialComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class PlanesProyectoEmpresarialRoutingModule { }
