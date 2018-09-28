import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {PlanMarcoFormacion} from '../../../entidades/plan-marco-formacion';
import {PlanRotacion} from '../../../entidades/plan-rotacion';
import {Estudiante} from '../../../entidades/estudiante';
import {PlanesRotacionService} from './planes-rotacion.service';
import 'rxjs/add/operator/toPromise';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from '../../../entidades/periodo-lectivo';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import swal from 'sweetalert2';

@Component({
    selector: 'app-planes-rotacion',
    templateUrl: './planes-rotacion.component.html',
    styleUrls: ['./planes-rotacion.component.scss']
})

export class PlanesRotacionComponent implements OnInit {
    personaLogeada: Persona;
    entidades: PlanMarcoFormacion[];
    planRotacion: PlanRotacion[];
    planRotacionTemporal: PlanRotacion;
    conocimientosPlanRotacion: PlanRotacion;
    estudiantes: Estudiante[];
    entidadSeleccionada: PlanRotacion;
    idPlanRotacion: number;
    periodoLectivoActual: PeriodoLectivo;
    pagina: 1;
    tamanoPagina: 20;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    flag: boolean;

    constructor(public toastr: ToastsManager,
                vcr: ViewContainerRef,
                private dataService: PlanesRotacionService,
                private dataDualService: DualService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }


    /* Funcion que se ejecuta al instante de haber accedido a la página */
    ngOnInit() {
        this.entidades = PlanMarcoFormacion[0];
        this.entidadSeleccionada = this.crearEntidad();
        this.planRotacionTemporal = this.crearEntidad();
        this.conocimientosPlanRotacion = this.crearEntidad();
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.getEstudiantesPorTutor(this.personaLogeada.id);
        this.getPeriodoLectivoActual();
        this.flag = true;
    }

    /* boton nuevo permite crear un nuevo registro */
    crearEntidad(): PlanRotacion {
        const nuevo = new PlanRotacion();
        nuevo.id = 0;
        nuevo.idEstudiante = 0;
        nuevo.conocimientosTeoricos = '';
        nuevo.conocimientosActitudinales = '';
        nuevo.conocimientosProcedimentales = '';
        return nuevo;
    }

    /*  */
    estaSeleccionado(porVerificar): boolean {
        if (this.entidadSeleccionada == null) {
            return false;
        }
        return porVerificar.id === this.entidadSeleccionada.id;
    }

    /*  */
    getEstudiantesPorTutor(idTutor): void {
        this.dataDualService
            .getEstudiantesPorTutor(idTutor)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta Estudiantes');
                } else {
                    this.estudiantes = entidadesRecuperadas
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta Estudiantes');
            });
    }

    /* funcion utilizada para obtener el plan de rotacion por cada estudiante */
    getPlanRotacionPorEstudiante(idEstudiante): void {
        if (idEstudiante !== 0) {
            this.flag = false;
            this.dataService
                .getPlanRotacionPorEstudiante(idEstudiante)
                .then(entidadesRecuperadas => {
                    this.planRotacion = null;
                    this.conocimientosPlanRotacion = null;
                    entidadesRecuperadas.forEach(value => {
                        this.planRotacionTemporal.estado = value.estado;
                        this.planRotacionTemporal.idPlanRotacion = value.idPlanRotacion;
                    });
                    if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta Plan de Rotación');
                        this.planRotacion = null;
                    } else {
                        this.planRotacion = entidadesRecuperadas;
                        this.conocimientosPlanRotacion = entidadesRecuperadas[0];
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta Plan de Rotación');
                });
        } else {
            console.log('no: ' + this.flag);
            this.flag = true;
        }
    }

    /* obtiene el periodo lectivo actual desde el Dual Service */
    getPeriodoLectivoActual(): void {
        this.dataDualService
            .getPeriodoLectivoActual()
            .then(entidadesRecuperadas => {
                this.periodoLectivoActual = entidadesRecuperadas
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta Periodo Lectivo');
            });
    }

    /* actualiza de forma parcial el plan general */
    guardarSemana(entidadParaActualizar: PlanRotacion): void {
        this.dataService.guardarSemana(entidadParaActualizar)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('La semana se actualió con éxito', 'Guardar Semana:');
                    this.refresh();
                } else {
                    this.toastr.error('Se produjo un error', 'Guardar Semana');
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Guardar Semana');
            });
    }

    guardarConocimientos(entidadTransporte: PlanRotacion): void {
        this.dataService.guardarConocimientos(entidadTransporte)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('Los conocimientos se guardaron con éxito', 'Guardar Conocimientos:');
                    this.refresh();
                } else {
                    this.toastr.success('Los conocimientos se actualizaron con éxito', 'Actualización Conocimientos:');
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Guardar Conocimientos');
            });
    }

    bloquearPlanRotacion(): void {
        swal({
            title: '¿Está seguro de Finalizar?',
            text: 'Se bloqueará el plan de rotación y no podrá realizar cambios',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fa fa-check-square" aria-hidden="true"></i> Finalizar'
        }).then((result) => {
            if (result.value) {
                this.dataService.bloquearPlanRotacion(this.planRotacionTemporal.idPlanRotacion)
                    .then(respuesta => {
                        if (respuesta) {
                            this.toastr.success('Se bloqueo con éxito', 'Bloqueo de Plan de Rotación:');
                            this.refresh();
                        } else {
                            this.toastr.error('Se produjo un error', 'Bloqueo Plan de Rotación');
                        }
                    })
                    .catch(error => {
                        this.toastr.error('Se produjo un error', 'Bloqueo Plan de Rotación');
                    });
            }
        });
    }

    /* Seleccionar por campo */
    onSelect(entidadActual: PlanRotacion): void {
        this.entidadSeleccionada = entidadActual;
    }

    /* Funcion que nos devuelve un nuevo formulario vacio */
    refresh(): void {
        this.getPlanRotacionPorEstudiante(this.entidadSeleccionada.idEstudiante);
        this.entidadSeleccionada.puestoAprendizaje = '';
    }

    /*  */
    resetEntidadSeleccionada(): void {
        this.entidadSeleccionada = this.crearEntidad();
    }
}
