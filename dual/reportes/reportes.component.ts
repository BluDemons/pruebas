import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as jsPDF from 'jspdf';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/toPromise';
import { EntidadFormadora } from '../../../entidades/entidad-formadora';
import { Persona } from '../../../entidades/persona';
import { DualService } from '../dual.service';
import { ReportesService } from './reportes.service';

@Component({
    selector: 'app-entidades-formadoras',
    templateUrl: './entidades-formadoras.component.html',
    styleUrls: ['./entidades-formadoras.component.scss']
})

export class EntidadesFormadorasComponent implements OnInit {
    personaLogeada: Persona;
    entidadesFormadoras: EntidadFormadora[];
    
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
   

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
                private dataServiceDual: DualService,
                private dataService: ReportesService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.getEntidadesFormadoras();
    }

    getEntidadesFormadoras(): void {
        this.dataService
            .getEntidadesFormadoras(this.paginaActual, this.registrosPorPagina)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.toastr.warning('¡No hay datos - Entidades Formadoras!', 'Consulta');
                    this.entidadesFormadoras = null;

                } else {
                    this.entidadesFormadoras = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
            const doc = new jsPDF(); 
            doc.save('EntidadFormadora' + this.entidadesFormadoras + '.pdf');
    }       
           
}
      