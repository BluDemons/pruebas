import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PlanesRotacionRoutingModule} from './planes-rotacion-routing.module';
import {PlanesRotacionComponent} from './planes-rotacion.component';
import {PlanesRotacionService} from './planes-rotacion.service';

import {DualService} from '../dual.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PlanesRotacionRoutingModule,
        NgbModule
    ],
    providers: [PlanesRotacionService, DualService],
    declarations: [PlanesRotacionComponent],
})
export class PlanesRotacionModule {
}
