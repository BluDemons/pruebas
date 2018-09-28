import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntidadesFormadorasComponent } from './entidades-formadoras.component';

const routes: Routes = [
   { path: '', component: EntidadesFormadorasComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class EntidadesFormadorasRoutingModule { }
