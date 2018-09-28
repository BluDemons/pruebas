import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RolSecundarioRoutingModule } from './rol-secundario-routing.module';
import { RolSecundarioComponent } from './rol-secundario.component';
import { RolSecundarioService } from './rol-secundario.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      RolSecundarioRoutingModule
   ],
   providers: [RolSecundarioService],
   declarations: [RolSecundarioComponent],
})
export class RolSecundarioModule { }
