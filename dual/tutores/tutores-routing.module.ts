import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutoresComponent } from './tutores.component';

const routes: Routes = [
   { path: '', component: TutoresComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TutoresRoutingModule { }
