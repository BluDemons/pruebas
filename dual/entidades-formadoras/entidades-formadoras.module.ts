import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {EntidadesFormadorasRoutingModule} from './entidades-formadoras-routing.module';
import {EntidadesFormadorasComponent} from './entidades-formadoras.component';
import {EntidadesFormadorasService} from './entidades-formadoras.service';
import {DualService} from '../dual.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EntidadesFormadorasRoutingModule
    ],
    providers: [EntidadesFormadorasService, DualService],
    declarations: [EntidadesFormadorasComponent],
})
export class EntidadesFormadorasModule {
}
