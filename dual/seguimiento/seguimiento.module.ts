import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {SeguimientoRoutingModule} from './seguimiento-routing.module';
import {SeguimientoComponent} from './seguimiento.component';
import {SeguimientoService} from './seguimiento.service';
import {DualService} from '../dual.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SeguimientoRoutingModule
    ],
    providers: [SeguimientoService, DualService],
    declarations: [SeguimientoComponent],
})
export class SeguimientoModule {
}
