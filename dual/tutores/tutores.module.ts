import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {TutoresRoutingModule} from './tutores-routing.module';
import {TutoresComponent} from './tutores.component';
import {TutoresService} from './tutores.service';
import {DualService} from '../dual.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TutoresRoutingModule
    ],
    providers: [TutoresService, DualService, HttpModule],
    declarations: [TutoresComponent],
})
export class TutoresModule {
}
