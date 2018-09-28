import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PlanesProyectoEmpresarialRoutingModule} from './planes-proyecto-empresarial-routing.module';
import {PlanesProyectoEmpresarialComponent} from './planes-proyecto-empresarial.component';
import {PlanesProyectoEmpresarialService} from './planes-proyecto-empresarial.service';
import {DualService} from '../dual.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PlanesProyectoEmpresarialRoutingModule,
        NgbModule
    ],
    providers: [PlanesProyectoEmpresarialService, DualService],
    declarations: [PlanesProyectoEmpresarialComponent],
})
export class PlanesProyectoEmpresarialModule {
}
