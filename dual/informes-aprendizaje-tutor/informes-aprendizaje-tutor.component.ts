import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {InformeAprendizajeTutor} from '../../../entidades/informe-aprendizaje-tutor';
import {InformesAprendizajeTutorService} from './informes-aprendizaje-tutor.service';

import 'rxjs/add/operator/toPromise';
import {ModalComponent} from 'app/layout/bs-component/components';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from '../../../entidades/periodo-lectivo';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import {InformeAprendizajeEstudiante} from '../../../entidades/informe-aprendizaje-estudiante';
import swal from 'sweetalert2';

@Component({
    selector: 'app-informes-aprendizaje-tutor',
    templateUrl: './informes-aprendizaje-tutor.component.html',
    styleUrls: ['./informes-aprendizaje-tutor.component.scss']
})

export class InformesAprendizajeTutorComponent implements OnInit {
    personaLogeada: Persona;
    entidades: InformeAprendizajeTutor[];
    numeroSemana: number;
    informesAprendizaje: InformeAprendizajeTutor[];
    estudiantes: InformeAprendizajeTutor[];
    actividadesInformeAprendizaje: InformeAprendizajeEstudiante[];
    entidadSeleccionada: InformeAprendizajeTutor;
    periodoLectivoActual: PeriodoLectivo;
    titulo: string;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    flag: boolean;
    flagGrid: boolean;

    constructor(public toastr: ToastsManager,
                vcr: ViewContainerRef,
                private dataService: InformesAprendizajeTutorService,
                private dataDualService: DualService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.entidadSeleccionada = this.crearEntidad();
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.getEstudiantesPorTutor(this.personaLogeada.id);
        this.getPeriodoLectivoActual();
        this.flag = true;
        this.flagGrid = true;
        this.titulo = 'Informes de Aprendizaje:';
    }

    estaSeleccionado(porVerificar): boolean {
        if (this.entidadSeleccionada == null) {
            return false;
        }
        return porVerificar.id === this.entidadSeleccionada.id;
    }

    resetEntidadSeleccionada(): void {
        this.entidadSeleccionada = this.crearEntidad();
    }

    cambiarFlag(opcion) {
        switch (opcion) {
            case 'ver':
                this.flag = false;
                this.titulo = 'Actividades:';
                break;
            case 'regresar':
                this.flag = true;
                this.titulo = 'Informes de Aprendizaje:';
                break;
        }
    }

    getEstudiantesPorTutor(idTutor): void {
        this.dataService
            .getEstudiantesPorTutor(idTutor)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.success('¡No hay datos!', 'Consulta');
                } else {
                    this.estudiantes = entidadesRecuperadas
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    getInformesAprendizajePorEstudiante(idEstudiante): void {
        if (!(idEstudiante === undefined || idEstudiante === 0 || idEstudiante == null)) {
            this.dataService
                .getInformesAprendizajePorEstudiante(idEstudiante)
                .then(entidadesRecuperadas => {
                    if (entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.informesAprendizaje = null;
                    } else {
                        this.informesAprendizaje = entidadesRecuperadas
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    getActividadesPorInformeAprendizaje(idInformeAprendizaje): void {
        this.flag = false;
        if (!(idInformeAprendizaje === undefined || idInformeAprendizaje === 0 || idInformeAprendizaje == null)) {
            this.dataService
                .getActividadesPorInformeAprendizaje(idInformeAprendizaje)
                .then(entidadesRecuperadas => {
                    entidadesRecuperadas.forEach(value => {
                        this.numeroSemana = value.semana;
                    });
                    if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.actividadesInformeAprendizaje = entidadesRecuperadas;
                    } else {
                        this.actividadesInformeAprendizaje = entidadesRecuperadas;
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    getPeriodoLectivoActual(): void {
        this.dataDualService
            .getPeriodoLectivoActual()
            .then(entidadesRecuperadas => {
                this.periodoLectivoActual = entidadesRecuperadas
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    crearEntidad(): InformeAprendizajeTutor {
        const nuevoInformesAprendizaje = new InformeAprendizajeTutor();
        nuevoInformesAprendizaje.id = 0;
        nuevoInformesAprendizaje.idEstudiante = 0;
        return nuevoInformesAprendizaje;
    }

    guardarCalificacion(entidadTransporte: InformeAprendizajeTutor, prioridad: number): void {
        const validacion = this.validarCamposObligatorios(entidadTransporte);
        console.log('validacion' + validacion);
        if (validacion == '') {
            swal({
                title: '¿Está seguro de Calificar?',
                text: 'Se Calificará el informe de aprendizaje y no podrá realizar cambios',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: '<i class="fa fa-check-square" aria-hidden="true"></i> Calificar'
            }).then((result) => {
                if (result.value) {
                    entidadTransporte.prioridad = prioridad;
                    this.dataService.guardarCalificacion(entidadTransporte)
                        .then(respuesta => {
                            if (respuesta) {
                                this.toastr.success('La calificación se ingreso con éxito', 'Calificación');
                                this.refresh();
                            } else {
                                this.toastr.warning('Se produjo un error', 'Actualización');
                            }
                            this.refresh();
                        })
                        .catch(error => {
                            this.toastr.error('Se produjo un error', 'Actualización');
                        });
                }
            });
        } else {
            this.toastr.error(validacion, 'Los siguientes campos faltan o están mal ingreasdos:');
        }
    }

    refresh(): void {
        this.getInformesAprendizajePorEstudiante(this.entidadSeleccionada.idEstudiante);
    }

    onSelect(entidadActual: InformeAprendizajeTutor): void {
        this.entidadSeleccionada = entidadActual;
    }

    validarCamposObligatorios(entidadTransporte: InformeAprendizajeTutor): string {
        let errores = '';
        if (entidadTransporte.calificacion < 0 || entidadTransporte.calificacion > 100) {
            errores += '- Calificación entre 0 y 100';
        }
        if (entidadTransporte.calificacion == null || entidadTransporte.calificacion === undefined) {
            errores += '- Calificación mal ingresada';
        }
        if (entidadTransporte.observaciones === ' ' || entidadTransporte.observaciones == null
            || entidadTransporte.observaciones === undefined) {
            errores += ' - Observaciones';
        }
        return errores;
    }

}
