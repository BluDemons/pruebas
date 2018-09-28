import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {PlanesMarcoFormacionService} from '../planes-marco-formacion/planes-marco-formacion.service';
import {PlanesMarcoFormacionComponent} from '../planes-marco-formacion/planes-marco-formacion.component';

import {PlanesRotacionComponent} from '../planes-rotacion/planes-rotacion.component';
import {PlanesRotacionService} from '../planes-rotacion/planes-rotacion.service';

import {PlanesProyectoEmpresarialComponent} from '../planes-proyecto-empresarial/planes-proyecto-empresarial.component';
import {PlanesProyectoEmpresarialService} from '../planes-proyecto-empresarial/planes-proyecto-empresarial.service';

import {SeguimientoTutorRoutingModule} from './seguimiento-tutor-routing.module';
import {SeguimientoTutorComponent} from './seguimiento-tutor.component';
import {SeguimientoTutorService} from './seguimiento-tutor.service';
import {DualService} from '../dual.service';
import {FotoPerfilService} from '../foto-perfil/foto-perfil.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        SeguimientoTutorRoutingModule

    ],
    providers: [
        SeguimientoTutorService,
        DualService,
        FotoPerfilService,
        PlanesMarcoFormacionService,
        PlanesRotacionService,
        PlanesProyectoEmpresarialService],
    declarations: [
        SeguimientoTutorComponent],
})
export class SeguimientoTutorModule {
}
