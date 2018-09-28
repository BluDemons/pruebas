import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PlanesMarcoFormacionRoutingModule} from './planes-marco-formacion-routing.module';
import {PlanesMarcoFormacionComponent} from './planes-marco-formacion.component';
import {PlanesMarcoFormacionService} from './planes-marco-formacion.service';
import {DualService} from '../dual.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PlanesMarcoFormacionRoutingModule,
        NgbModule
    ],
    providers: [PlanesMarcoFormacionService, DualService],
    declarations: [PlanesMarcoFormacionComponent],
})
export class PlanesMarcoFormacionModule {
}
