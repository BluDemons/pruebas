import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {EntidadesFormadorasRoutingModule} from './reportes-routing.module';
import {EntidadesFormadorasComponent} from './reportes.component';
import {ReportesService} from './reportes.service';
import {DualService} from '../dual.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EntidadesFormadorasRoutingModule
    ],
    providers: [ReportesService, DualService],
    declarations: [EntidadesFormadorasComponent],
})
export class EntidadesFormadorasModule {
}
