import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {InformesAprendizajeTutorRoutingModule} from './informes-aprendizaje-tutor-routing.module';
import {InformesAprendizajeTutorComponent} from './informes-aprendizaje-tutor.component';
import {InformesAprendizajeTutorService} from './informes-aprendizaje-tutor.service';
import {DualService} from '../dual.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InformesAprendizajeTutorRoutingModule
    ],
    providers: [InformesAprendizajeTutorService, DualService],
    declarations: [InformesAprendizajeTutorComponent],
})
export class InformesAprendizajeTutorModule {
}
