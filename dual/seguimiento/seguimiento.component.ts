import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Seguimiento} from '../../../entidades/seguimiento';
import {SeguimientoService} from './seguimiento.service';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from 'app/entidades/periodo-lectivo';
import 'rxjs/add/operator/toPromise';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import swal from 'sweetalert2';

@Component({
    selector: 'app-seguimiento',
    templateUrl: './seguimiento.component.html',
    styleUrls: ['./seguimiento.component.scss']
})

export class SeguimientoComponent implements OnInit {
    personaLogeada: Persona;
    seguimiento: Seguimiento[];
    estudiantesFiltrado: Seguimiento[];
    entidadesFormadoras: Seguimiento[];
    tutoresAcademicos: Seguimiento[];
    tutoresGenerales: Seguimiento[];
    tutoresEspecificos: Seguimiento[];
    periodosAcademicos: Seguimiento[];
    entidadSeleccionada: Seguimiento;
    periodoLectivoActual: PeriodoLectivo;
    pagina: 1;
    tamanoPagina: 20;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    private flag: boolean;
    private flagPaginado: boolean;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
                private dataServiceDual: DualService,
                private dataService: SeguimientoService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        // Para llenar el combo de periodos lectivos de la pantalla principal
        this.getPeriodoLectivoActual();

        // Para filtrar los estudiantes cuando se va a crear una nueva asignacion,
        // se pone ninguno para que no cargue nada en primera instancia
        this.getSeguimientoEstudiantesFiltrado('ninguno');

        // Para llenanr el combo de entidades formadoras cuando se va a crear una nueva asignacion
        this.getSeguimientoEntidadesFormadoras();

        // Para llenanr el combo de tutores academicos cuando se va a crear una nueva asignacion
        this.getSeguimientoTutoresAcademicos();

        // Para llenanr el combo de tutores genalres cuando se va a crear una nueva asignacion
        this.getSeguimientoTutoresGenerales();

        // Para llenanr el combo de tutores especificos cuando se va a crear una nueva asignacion
        this.getSeguimientoTutoresEspecificos();

        // Para llenanr el combo de periodos academicos cuando se va a crear una nueva asignacion
        this.getSeguimientoPeriodosAcademicos();
        this.refresh();
        this.flag = true;
        this.flagPaginado = false;
    }

    open(content, nuevo) {
        if (nuevo) {
            this.resetEntidadSeleccionada();
        }
        this.modalService.open(content)
            .result
            .then((result => {
                if (result === 'save') {
                    this.aceptar();
                }
            }), (result => {
                // Esto se ejecuta si la ventana se cierra sin aceptar los cambios
            }));
    }

    getSeguimientoEstudiantesActual(): void {
        this.dataService
            .getSeguimientoEstudiantesActual(this.paginaActual, this.registrosPorPagina)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                    this.seguimiento = null;
                } else {
                    this.seguimiento = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    getSeguimientoEstudiantesFiltrado(parametroBusqueda): void {
        this.dataService
            .getSeguimientoEstudiantesFiltrado(parametroBusqueda)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.estudiantesFiltrado = null;
                } else {
                    this.estudiantesFiltrado = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });

    }

    getSeguimientoEntidadesFormadoras(): void {
        this.dataService
            .getSeguimientoEntidadesFormadoras()
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                } else {
                    this.entidadesFormadoras = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });

    }

    getSeguimientoTutoresAcademicos(): void {
        this.dataService
            .getSeguimientoTutoresAcademicos()
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                } else {
                    this.tutoresAcademicos = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });

    }

    getSeguimientoTutoresGenerales(): void {
        this.dataService
            .getSeguimientoTutoresGenerales()
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                } else {
                    this.tutoresGenerales = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });

    }

    getSeguimientoTutoresEspecificos(): void {
        this.dataService
            .getSeguimientoTutoresEspecificos()
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                } else {
                    this.tutoresEspecificos = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });

    }

    getSeguimientoPeriodosAcademicos(): void {
        this.dataService
            .getSeguimientoPeriodosAcademicos()
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                } else {
                    this.periodosAcademicos = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });

    }

    getPeriodoLectivoActual() {
        this.dataServiceDual.getPeriodoLectivoActual()
            .then(respuesta => this.periodoLectivoActual = respuesta)
            .catch(error => {
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
        this.entidadSeleccionada.idEntidadFormadora = 0;
        this.entidadSeleccionada.idTutorAcademico = 0;
        this.entidadSeleccionada.idTutorGeneral = 0;
        this.entidadSeleccionada.idTutorEspecifico = 0;
        this.entidadSeleccionada.idPeriodoAcademico = 0;
        this.entidadSeleccionada.idEstudiante = 0;
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

    isValid(entidadPorEvaluar: Seguimiento): boolean {
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

    crearEntidad(): Seguimiento {
        const nuevoSeguimiento = new Seguimiento();
        nuevoSeguimiento.id = 0;
        return nuevoSeguimiento;
    }

    create(entidadNueva: Seguimiento): void {
        console.log(entidadNueva.idEstudiante);
        const validacion = this.validarCampos(entidadNueva);
        console.log('validacion: ' + validacion);
        if (validacion === '') {
            this.dataService.create(entidadNueva)
                .then(respuesta => {
                    if (respuesta) {
                        this.toastr.success('La creación fue exitosa', 'Creación');
                        this.getSeguimientoEstudiantesFiltrado('ninguno');
                    } else {
                        this.toastr.warning('Se produjo un error', 'Creación');
                    }
                    this.entidadSeleccionada.idEstudiante = 0;
                })
                .catch(error => {
                    this.toastr.warning('Se produjo un error', 'Creación');
                    this.entidadSeleccionada.idEstudiante = 0;
                });
        } else {
            this.toastr.error(validacion, 'Faltan los siguientes campos:');
        }
    }

    update(entidadParaActualizar: Seguimiento): void {
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

    delete(entidadTransporte: Seguimiento): void {
        swal({
            title: '¿Está seguro de Eliminar?',
            text: entidadTransporte.apellidosEstudiante + ' ' + entidadTransporte.nombresEstudiante,
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
                    this.dataService.remove(entidadTransporte.id)
                        .then(respuesta => {
                            if (respuesta) {
                                this.toastr.success('La eliminación fue exitosa', 'Eliminación');
                            } else {
                                this.toastr.error('Se produjo un error', 'Eliminación');
                            }
                            this.refresh();
                        })
                        .catch(error => {
                            this.toastr.error('Se produjo un error', 'Eliminación');
                        });
                }
            }
        });
    }

    refresh(): void {
        this.getNumeroPaginas(this.registrosPorPagina);
        this.getSeguimientoEstudiantesActual();
        this.seguimiento = Seguimiento[0];
        this.entidadSeleccionada = this.crearEntidad();
    }

    getPaginaPrimera(): void {
        this.paginaActual = 1;
        this.flagPaginado = false;
        this.refresh();
    }

    getPaginaAnterior(): void {
        if (this.paginaActual > 1) {
            this.paginaActual = this.paginaActual - 1;
            this.flagPaginado = false;
            this.refresh();
        }
    }

    getPaginaSiguiente(): void {
        if (this.paginaActual < this.paginaUltima) {
            this.paginaActual = this.paginaActual + 1;
            this.flagPaginado = false;
            this.refresh();
        }
    }

    getPaginaUltima(): void {
        this.paginaActual = this.paginaUltima;
        this.flagPaginado = false;
        this.refresh();
    }

    onSelect(entidadActual: Seguimiento): void {
        this.entidadSeleccionada = entidadActual;
    }

    validarCampos(entidadParaValidar: Seguimiento): string {
        let errores = '';
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
        }
        return errores;
    }
}
