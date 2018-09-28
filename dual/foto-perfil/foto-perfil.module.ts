import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FotoPerfilRoutingModule } from './foto-perfil-routing.module';
import { FotoPerfilComponent } from './foto-perfil.component';
import { FotoPerfilService } from './foto-perfil.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      FotoPerfilRoutingModule
   ],
   providers: [FotoPerfilService],
   declarations: [FotoPerfilComponent],
})
export class FotoPerfilModule { }
