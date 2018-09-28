import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {PlanMarcoFormacion} from '../../../entidades/plan-marco-formacion';
import {PlanesMarcoFormacionService} from './planes-marco-formacion.service';
import 'rxjs/add/operator/toPromise';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from '../../../entidades/periodo-lectivo';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import {Objetivo} from '../../../entidades/objetivo';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import swal from 'sweetalert2';

@Component({
    selector: 'app-planes-marco-formacion',
    templateUrl: './planes-marco-formacion.component.html',
    styleUrls: ['./planes-marco-formacion.component.scss']
})

export class PlanesMarcoFormacionComponent implements OnInit {
    @ViewChild('encabezadoPlanMarcoFormacion') encabezadoPlanMarcoFormacion: ElementRef;
    @ViewChild('cuerpoPlanMarcoFormacion') cuerpoPlanMarcoFormacion: ElementRef;
    @ViewChild('piePlanMarcoFormacion') piePlanMarcoFormacion: ElementRef;
    personaLogeada: Persona;
    planMarcoFormacion: PlanMarcoFormacion[];
    estudiantes: PlanMarcoFormacion[];
    entidadSeleccionada: PlanMarcoFormacion;
    entidadObjetivo: Objetivo;
    planMarcoFormacionTemporal: PlanMarcoFormacion;
    periodoLectivoActual: PeriodoLectivo;
    idPeriodoLectivoActual: number;
    pagina: 1;
    tamanoPagina: 20;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    flag: boolean;

    constructor(public toastr: ToastsManager,
                vcr: ViewContainerRef,
                private dataService: PlanesMarcoFormacionService,
                private dataDualService: DualService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.entidadSeleccionada = this.crearEntidad();
        this.planMarcoFormacionTemporal = this.crearEntidad();
        this.entidadObjetivo = this.crearEntidadObjetivo();
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.getEstudiantesPorTutor(this.personaLogeada.id);
        this.getPeriodoLectivoActual();
        this.flag = true;
    }

    generarPDFPlanMarcoFormacion() {
        html2canvas(this.encabezadoPlanMarcoFormacion.nativeElement).then(canvasEncabezado => {
            const encabezadoPlanMarcoFormacionImg = canvasEncabezado.toDataURL('image/png');
            html2canvas(this.cuerpoPlanMarcoFormacion.nativeElement).then(canvasCuerpo => {
                const cuerpoPlanMarcoFormacionImg = canvasCuerpo.toDataURL('image/png');
                html2canvas(this.piePlanMarcoFormacion.nativeElement).then(canvasPie => {
                    const piePlanMarcoFormacionImg = canvasPie.toDataURL('image/png');
                    const doc = new jsPDF();
                    doc.addImage(encabezadoPlanMarcoFormacionImg, 'PNG', 10, 10, 190, 30);
                    doc.addImage(cuerpoPlanMarcoFormacionImg, 'PNG', 30, 40, 160, 217);
                    doc.addImage(piePlanMarcoFormacionImg, 'PNG', 10, 257, 190, 30);
                    doc.save();
                });
            });
        });
    }

// Podemos seleccionar un registro
    estaSeleccionado(porVerificar): boolean {
        if (this.entidadSeleccionada == null) {
            return false;
        }
        return porVerificar.id === this.entidadSeleccionada.id;
    }

    resetEntidadSeleccionada(): void {
        this.entidadSeleccionada = this.crearEntidad();
    }

// Esta funcion trabaja con el service consumiendo su informacion
    getEstudiantesPorTutor(idTutor): void {
        this.dataService
            .getEstudiantesPorTutor(idTutor)
            .then(entidadesRecuperadas => {
                this.estudiantes = entidadesRecuperadas;
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error: ' + error, 'Consulta');
            });
    }

// Esta funcion trabaja con el service consumiendo su informacion
    getPlanMarcoFormacionPorEstudiante(idEstudiante): void {
        this.planMarcoFormacion = null;
        if (idEstudiante.toString() !== '0') {
            this.flag = false;
            this.dataService
                .getPlanMarcoFormacionPorEstudiante(idEstudiante)
                .then(entidadesRecuperadas => {
                    entidadesRecuperadas.forEach(value => {
                        this.planMarcoFormacionTemporal.estado = value.estado;
                        this.planMarcoFormacionTemporal.id = value.idPlanMarcoFormacion;
                    });
                    if (entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.planMarcoFormacion = null;
                        this.planMarcoFormacionTemporal.estado = 0;
                    } else {
                        this.planMarcoFormacion = entidadesRecuperadas;
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error: ' + error, 'Consulta');
                });
        } else {
            console.log('no');
            this.flag = true;
        }
    }

// Nos da el periodo lectivo q esta guardado en la base de datos
    getPeriodoLectivoActual(): void {
        this.dataDualService
            .getPeriodoLectivoActual()
            .then(entidadesRecuperadas => {
                this.periodoLectivoActual = entidadesRecuperadas;

            })
            .catch(error => {
                this.toastr.error('Se produjo un error: ' + error, 'Consulta');
            });
    }

// Esta funcion crea un nuevo registro mediante el service
    crearEntidad(): PlanMarcoFormacion {
        const nuevoInformesAprendizaje = new PlanMarcoFormacion();
        nuevoInformesAprendizaje.id = 0;
        nuevoInformesAprendizaje.idEstudiante = 0;
        nuevoInformesAprendizaje.estado = 0;
        return nuevoInformesAprendizaje;
    }

    crearEntidadObjetivo(): Objetivo {
        const nuevo = new Objetivo();
        nuevo.id = 0;
        nuevo.idEstudiante = 0;
        return nuevo;
    }

// se guarda la informacion que se ingreso al registro
    guardarObjetivo(entidadTransporte: Objetivo, idEstudiante: number): void {
        const validacion = this.validarCampos(entidadTransporte);
        if (validacion === '') {
            this.dataService.guardarObjetivo(entidadTransporte, idEstudiante, this.periodoLectivoActual[0].id)
                .then(respuesta => {
                    if (respuesta) {
                        this.toastr.success('El registro fue exitoso', 'Guardar');
                        this.refresh();
                    } else {
                        this.toastr.warning('Se produjo un error', 'Actualización');
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error: ' + error, 'Actualización');
                });
        } else {
            this.toastr.error(validacion, 'Falta los siguientes campos:');
        }
    }

    bloquearPlanMarcoFormacion(): void {
        swal({
            title: '¿Está seguro de Finalizar?',
            text: 'Se bloqueará el plan maro de formación y no podrá realizar cambios',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fa fa-check-square" aria-hidden="true"></i> Finalizar'
        }).then((result) => {
            if (result.value) {
                this.dataService.bloquearPlanMarcoFormacion(this.planMarcoFormacionTemporal)
                    .then(respuesta => {
                        if (respuesta) {
                            this.toastr.success('El Plan Marco de Formación fue generado con éxito', 'Plan Marco de Formación');
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

    actualizarObjetivo(entidadParaActualizar: Objetivo): void {
        this.dataService.actualizarObjetivo(entidadParaActualizar)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('La actualización fue exitosa', 'Actualización');
                    this.refresh();
                } else {
                    this.toastr.warning('No se han realizado cambios', 'Actualización');
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error: ' + error, 'Consulta');
            });
    }

    actualizarNivelLogroAlcanzado(entidadParaActualizar: Objetivo): void {
        this.dataService.actualizarNivelLogroAlcanzado(entidadParaActualizar)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('La actualización fue exitosa', 'Actualización');
                    this.refresh();
                } else {
                    this.toastr.warning('No se han realizado cambios', 'Actualización');
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error: ' + error, 'Consulta');
            });
    }

    borrarObjetivo(entidadParaActualizar: PlanMarcoFormacion): void {
        this.dataService.borrarObjetivo(entidadParaActualizar.id)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('La eliminación fue exitosa', 'Eliminación');
                    this.refresh();
                } else {
                    this.toastr.warning('Se produjo un error', 'Actualización');
                }
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Borrar');
            });
    }

// Vuelve a cargar la paguina automaticamente
    refresh(): void {
        this.entidadObjetivo = this.crearEntidadObjetivo();
        this.getPlanMarcoFormacionPorEstudiante(this.entidadSeleccionada.idEstudiante);
    }

    onSelect(entidadActual: PlanMarcoFormacion): void {
        this.entidadSeleccionada = entidadActual;
    }

    validarCampos(entidadTransporte): string {
        let errores = '';
        if (entidadTransporte.descripcion === undefined || entidadTransporte.descripcion === ' ') {
            errores += 'Descripción - ';
        }
        if (entidadTransporte.nivelLogroEsperado === undefined || entidadTransporte.nivelLogroEsperado === ' ') {
            errores += 'Nivel de Logro Esperado - ';
        }
        if (entidadTransporte.tareas === undefined || entidadTransporte.tareas === ' ') {
            errores += 'Tareas - ';
        }
        if (entidadTransporte.puestoAprendizaje === undefined || entidadTransporte.puestoAprendizaje === ' ') {
            errores += 'Puesto de Aprendizaje - ';
        }
        if (entidadTransporte.semanasTrabajo === undefined || entidadTransporte.semanasTrabajo === ' ') {
            errores += 'Semanas de Trabajo - ';
        }
        if (entidadTransporte.responsable === undefined || entidadTransporte.responsable === ' ') {
            errores += 'Responsable';
        }
        return errores;
    }

}
