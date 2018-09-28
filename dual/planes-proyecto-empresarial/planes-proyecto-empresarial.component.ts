import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {PlanesProyectoEmpresarialService} from './planes-proyecto-empresarial.service';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from 'app/entidades/periodo-lectivo';
import 'rxjs/add/operator/toPromise';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import {PlanProyectoEmpresarial} from '../../../entidades/plan-proyecto-empresarial';
import {Estudiante} from '../../../entidades/estudiante';
import {NgbModalOptions} from '@ng-bootstrap/ng-bootstrap/modal/modal';
import * as jsPDF from 'jspdf';
import swal from 'sweetalert2';

@Component({
    selector: 'app-proyecto-empresarial',
    templateUrl: './planes-proyecto-empresarial.component.html',
    styleUrls: ['./planes-proyecto-empresarial.component.scss']
})

export class PlanesProyectoEmpresarialComponent implements OnInit {
    @ViewChild('encabezadoPlanProyectoEmpresarial') encabezadoPlanProyectoEmpresarial: ElementRef;
    @ViewChild('cuerpoPlanProyectoEmpresarial') cuerpoPlanProyectoEmpresarial: ElementRef;
    @ViewChild('piePlanProyectoEmpresarial') piePlanProyectoEmpresarial: ElementRef;
    personaLogeada: Persona;
    estudiantes: Estudiante[];
    planProyectoEmpresarial: PlanProyectoEmpresarial;
    planesProyectoEmpresarial: PlanProyectoEmpresarial[];
    entidadSeleccionada: PlanProyectoEmpresarial;
    periodoLectivoActual: PeriodoLectivo;
    pagina: 1;
    tamanoPagina: 20;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    flag: boolean;
    flagReporte: boolean;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
                private dataDualService: DualService,
                private dataService: PlanesProyectoEmpresarialService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.getPeriodoLectivoActual();
        this.getEstudiantesPorTutor(this.personaLogeada.id);
        this.refresh();
        this.flag = true;
        this.flagReporte = false;
    }

    getEstudiantesPorTutor(idTutor): void {
        this.dataDualService
            .getEstudiantesPorTutor(idTutor)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                } else {
                    this.estudiantes = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    open(content, nuevo) {
        const logoutScreenOptions: NgbModalOptions = {
            size: 'lg'
        };
        if (nuevo) {
            this.resetEntidadSeleccionada();
        }
        this.modalService.open(content, logoutScreenOptions)
            .result
            .then((result => {
                if (result === 'save') {
                    this.aceptar();
                }
            }), (result => {
                // Esto se ejecuta si la ventana se cierra sin aceptar los cambios
            }));
    }

    getPeriodoLectivoActual() {
        this.dataDualService.getPeriodoLectivoActual()
            .then(respuesta => this.periodoLectivoActual = respuesta)
            .catch(error => {
            });
    }

    getPlanProyectoEmpresarialPorEstudiante(idEstudiante): void {
        if (this.entidadSeleccionada.idEstudiante === 0 || this.entidadSeleccionada.idEstudiante === undefined) {
            this.flag = true;
            this.planProyectoEmpresarial = null;
            this.entidadSeleccionada = null;
        } else {
            this.flag = false;
        }
        this.dataService
            .getPlanProyectoEmpresarialPorEstudiante(idEstudiante)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                    this.planProyectoEmpresarial = null;
                    this.entidadSeleccionada = null;
                } else {
                    this.planProyectoEmpresarial = entidadesRecuperadas;
                    this.entidadSeleccionada = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    getPlanesProyectoEmpresarial(): void {
        this.dataService
            .getPlanesProyectoEmpresarial(this.personaLogeada.id, this.paginaActual, this.registrosPorPagina)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                    this.planesProyectoEmpresarial = null;
                } else {
                    this.planesProyectoEmpresarial = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    menu(opcion) {
        switch (opcion) {
            case 'nuevo':
                this.resetEntidadSeleccionada();
                this.flag = false;
                break;
            case 'regresar':
                this.refresh();
                this.flag = true;
                break;
        }
    }

    estaSeleccionado(porVerificar): boolean {
        if (this.entidadSeleccionada == null) {
            return false;
        }
        return porVerificar.id === this.entidadSeleccionada.id;
    }

    bloquearPlanProyectoEmpresarial(): void {
        swal({
            title: '¿Está seguro de Finalizar?',
            text: 'Se bloqueará el plan de proyecto empresarial y no podrá realizar cambios',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fa fa-check-square" aria-hidden="true"></i> Finalizar'
        }).then((result) => {
            if (result.value) {
                this.dataService.bloquearPlanProyectoEmpresarial(this.entidadSeleccionada)
                    .then(respuesta => {
                        if (respuesta) {
                            this.toastr.success('El Plan Proyecto Empresarial fue generado con éxito', 'Plan Proyecto Empresarial');
                            this.refresh();
                        } else {
                            this.toastr.warning('Se produjo un error', 'Actualización');
                        }
                    })
                    .catch(error => {
                        this.toastr.error('Se produjo un error: ' + error, 'Consulta');
                    });
            }
        });
    }

    cerrarVentanaEdicion(): void {
        this.esVisibleVentanaEdicion = false;
    }

    mostrarVentanaNuevo(): void {
        this.resetEntidadSeleccionada();
        this.esVisibleVentanaEdicion = true;
    }

    mostrarVentanaEdicion(): void {
        this.esVisibleVentanaEdicion = true;
    }

    resetEntidadSeleccionada(): void {
        this.entidadSeleccionada = this.crearEntidad();
    }

    getNumeroPaginas(tamanoPagina: number): void {
        this.dataService
            .getNumeroPaginas(tamanoPagina)
            .then(respuesta => {
                this.paginaUltima = respuesta.paginas;
            })
            .catch(error => {
                // Error al leer las paginas
            });
    }

    isValid(entidadPorEvaluar: PlanProyectoEmpresarial): boolean {
        return true;
    }

    aceptar(): void {
        if (!this.isValid(this.entidadSeleccionada)) {
            return;
        }
        if (this.entidadSeleccionada.id === undefined || this.entidadSeleccionada.id === 0) {
            this.create(this.entidadSeleccionada);
        } else {
            this.update(this.entidadSeleccionada);
        }
        this.cerrarVentanaEdicion();
    }

    crearEntidad(): PlanProyectoEmpresarial {
        const nuevo = new PlanProyectoEmpresarial();
        nuevo.id = 0;
        nuevo.idEstudiante = 0;
        return nuevo;
    }

    create(entidadNueva: PlanProyectoEmpresarial): void {
        console.log('id' + entidadNueva.id);
        console.log('idEstudiante' + entidadNueva.idEstudiante);
        console.log('titulo ' + entidadNueva.titulo);
        console.log('analisis ' + entidadNueva.analisis);
        console.log('objetivo ' + entidadNueva.objetivo);
        console.log('descripcion ' + entidadNueva.descripcion);
        console.log('indicador ' + entidadNueva.indicador);
        console.log('medicion ' + entidadNueva.medicion);
        console.log('meta ' + entidadNueva.meta);
        console.log('fuenteDatos ' + entidadNueva.fuenteDatos);
        console.log('presupuesto ' + entidadNueva.presupuesto);
        console.log('beneficiosEsperados ' + entidadNueva.beneficiosEsperados);

        const validacion = this.validarCampos(entidadNueva);
        if (validacion === '') {
            this.dataService.create(entidadNueva)
                .then(respuesta => {
                    if (respuesta) {
                        this.toastr.success('La creación fue exitosa', 'Creación');
                    } else {
                        this.toastr.warning('Se produjo un error', 'Creación');
                    }
                })
                .catch(error => {
                    this.toastr.warning('Se produjo un error', 'Creación');
                });
        } else {
            this.toastr.error(validacion, 'Faltan los siguientes campos:');
        }
    }

    update(entidadParaActualizar: PlanProyectoEmpresarial): void {
        alert(this.entidadSeleccionada.descripcion);

        this.dataService.update(entidadParaActualizar)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('La actualización fue exitosa', 'Actualización');
                } else {
                    this.toastr.warning('Se produjo un error', 'Actualización 1');
                }
                this.refresh();
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Actualización 2');
            });
    }

    delete(entidadTransporte: PlanProyectoEmpresarial): void {
        swal({
            title: '¿Está seguro de Eliminar?',
            text: entidadTransporte.titulo,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fa fa-trash" aria-hidden="true"></i>'
        }).then((result) => {
            if (result.value) {
                if (entidadTransporte.id == null || entidadTransporte.id === undefined || entidadTransporte.id === 0) {
                    this.toastr.warning('Seleccione un registro', 'Eliminación');
                } else {
                    if (entidadTransporte.id == null || entidadTransporte.id === undefined || entidadTransporte.id === 0) {
                        this.toastr.warning('Seleccione un registro', 'Eliminación');
                    } else {
                        this.dataService.remove(entidadTransporte.id)
                            .then(respuesta => {
                                if (respuesta) {
                                    this.toastr.success('La eliminación fue exitosa', 'Eliminación');
                                } else {
                                    this.toastr.warning('Se produjo un error', 'Eliminación');
                                }
                                this.refresh();
                            })
                            .catch(error => {
                                this.toastr.error('Se produjo un error', 'Eliminación');
                            });
                    }
                }
            }
        });
    }

    refresh(): void {
        this.getNumeroPaginas(this.registrosPorPagina);
        this.getPlanesProyectoEmpresarial();
        this.entidadSeleccionada = this.crearEntidad();
    }

    getPaginaPrimera(): void {
        this.paginaActual = 1;
        this.refresh();
    }

    getPaginaAnterior(): void {
        if (this.paginaActual > 1) {
            this.paginaActual = this.paginaActual - 1;
            this.refresh();
        }
    }

    getPaginaSiguiente(): void {
        if (this.paginaActual < this.paginaUltima) {
            this.paginaActual = this.paginaActual + 1;
            this.refresh();
        }
    }

    getPaginaUltima(): void {
        this.paginaActual = this.paginaUltima;
        this.refresh();
    }

    onSelect(entidadActual: PlanProyectoEmpresarial): void {
        this.entidadSeleccionada = entidadActual;
    }

    validarCampos(entidadParaValidar: PlanProyectoEmpresarial): string {
        let errores = '';
        /*
        if (entidadParaValidar.idEntidadFormadora === 0 ||
            entidadParaValidar.idEntidadFormadora === undefined || entidadParaValidar.idEntidadFormadora == null) {
            errores += 'Entidad Formadora - ';
        }
        if (entidadParaValidar.idTutorAcademico === 0) {
            errores += 'Tutor Academico - ';
        }
        if (entidadParaValidar.idTutorEspecifico === 0) {
            errores += 'Tutor Especifico - ';
        }
        if (entidadParaValidar.idTutorGeneral === 0) {
            errores += 'Tutor General - ';
        }
        if (entidadParaValidar.horasFormacion === 0 ||
            entidadParaValidar.horasFormacion === undefined || entidadParaValidar.horasFormacion == null) {
            errores += 'Horas de Formacion - ';
        }
        if (entidadParaValidar.idEstudiante === 0 ||
            entidadParaValidar.idEstudiante === undefined || entidadParaValidar.idEstudiante == null) {
            errores += 'Estudiante - ';
        }
        if (entidadParaValidar.idPeriodoAcademico === 0) {
            errores += 'Periodo Academico';
        }*/
        return errores;
    }

    generarPDFPlanProyectoEmpresarial(): void {
        this.flagReporte = true;
        const pdf = new jsPDF();
        pdf.setFontSize(15);
        pdf.setTextColor(0, 0, 130);
        pdf.setFontType('bolditalic');
        pdf.text(100, 10, 'Resultado Test de la Acción Humana – HAT');
        pdf.save();

        this.flagReporte = false;
    }
}
