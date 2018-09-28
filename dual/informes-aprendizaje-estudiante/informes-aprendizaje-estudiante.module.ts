import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {InformesAprendizajeEstudianteRoutingModule} from './informes-aprendizaje-estudiante-routing.module';
import {InformesAprendizajeEstudianteComponent} from './informes-aprendizaje-estudiante.component';
import {InformesAprendizajeEstudianteService} from './informes-aprendizaje-estudiante.service';
import {DualService} from '../dual.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InformesAprendizajeEstudianteRoutingModule
    ],
    providers: [InformesAprendizajeEstudianteService, DualService],
    declarations: [InformesAprendizajeEstudianteComponent],
})
export class InformesAprendizajeEstudianteModule {
}
