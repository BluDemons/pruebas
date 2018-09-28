import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {InformeAprendizajeEstudiante} from '../../../entidades/informe-aprendizaje-estudiante';
import {InformesAprendizajeEstudianteService} from './informes-aprendizaje-estudiante.service';
import 'rxjs/add/operator/toPromise';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from '../../../entidades/periodo-lectivo';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import swal from 'sweetalert2';

@Component({
    selector: 'app-informes-aprendizaje-estudiante',
    templateUrl: './informes-aprendizaje-estudiante.component.html',
    styleUrls: ['./informes-aprendizaje-estudiante.component.scss']
})

export class InformesAprendizajeEstudianteComponent implements OnInit {
    personaLogeada: Persona;
    numeroUltimaSemana: number;
    idPlanMarcoFormacion: number;
    informesAprendizaje: InformeAprendizajeEstudiante[];
    informesAprendizajeTemporal: InformeAprendizajeEstudiante;
    actividadesInformeAprendizaje: InformeAprendizajeEstudiante[];
    estadoInformeActividad: number;
    estudiantes: InformeAprendizajeEstudiante[];
    entidadSeleccionada: InformeAprendizajeEstudiante;
    idInformeAprendizaje: number;
    periodoLectivoActual: PeriodoLectivo;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    flag: boolean;
    flagNuevaActividad: boolean;
    titulo: string;

    constructor(public toastr: ToastsManager,
                vcr: ViewContainerRef,
                private dataService: InformesAprendizajeEstudianteService,
                private dataDualService: DualService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.entidadSeleccionada = this.crearEntidad();
        this.informesAprendizajeTemporal = this.crearEntidad();
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.getInformesAprendizajePorEstudiante(this.personaLogeada.id);
        this.getPeriodoLectivoActual();
        this.flag = true;
        this.flagNuevaActividad = true;
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

    getNumeroUltimaSemana(): void {
        console.log('plan marco ' + this.idPlanMarcoFormacion);
        if (this.idPlanMarcoFormacion === undefined) {
            this.idPlanMarcoFormacion = 0;
        }
        this.dataService
            .getNumeroUltimaSemana(this.idPlanMarcoFormacion)
            .then(entidadesRecuperadas => {
                console.log(entidadesRecuperadas[0].toString())
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.numeroUltimaSemana = 1;
                } else {
                    this.numeroUltimaSemana = entidadesRecuperadas[0].semanas;
                }
                console.log(this.numeroUltimaSemana);
            })
            .catch(error => {
                this.toastr.success('Se produjo un error', 'Consulta');
            });
    }

    getInformesAprendizajePorEstudiante(idPersona): void {
        this.dataService
            .getInformesAprendizajePorEstudiante(idPersona)
            .then(entidadesRecuperadas => {
                entidadesRecuperadas.forEach(value => {
                    this.idPlanMarcoFormacion = value.idPlanMarcoFormacion;
                });
                if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                    this.informesAprendizaje = null;
                } else {
                    this.informesAprendizaje = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.success('Se produjo un error', 'Consulta');
            });
    }

    getActividadesPorInformeAprendizaje(idInformeAprendizaje): void {
        console.log('estado informe: ' + this.informesAprendizajeTemporal.estado)
        if (!(idInformeAprendizaje === undefined || idInformeAprendizaje === 0 || idInformeAprendizaje == null)) {
            this.dataService
                .getActividadesPorInformeAprendizaje(idInformeAprendizaje)
                .then(entidadesRecuperadas => {
                    entidadesRecuperadas.forEach(value => {
                        this.idInformeAprendizaje = value.idInformeAprendizaje;
                        this.estadoInformeActividad = value.estado;
                        this.numeroUltimaSemana = value.semana;
                        this.informesAprendizajeTemporal.estado = value.estado;
                    });
                    if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.actividadesInformeAprendizaje = null;
                        this.flag = true;
                        this.getInformesAprendizajePorEstudiante(this.personaLogeada.id);
                    } else {
                        this.actividadesInformeAprendizaje = entidadesRecuperadas;
                    }
                })
                .catch(error => {
                    this.toastr.success('Se produjo un error', 'Consulta');
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
                this.toastr.success('Se produjo un error', 'Consulta');
            });
    }

    getNumeroPaginas(registrosPorPagina: number): void {
        this.dataService
            .getNumeroPaginas(registrosPorPagina)
            .then(respuesta => {
                this.paginaUltima = respuesta.paginas;
            })
            .catch(error => {
                // Error al leer las paginas
            });
    }

    isValid(entidadPorEvaluar: InformeAprendizajeEstudiante): boolean {
        return true;
    }

    crearEntidad(): InformeAprendizajeEstudiante {
        const nuevo = new InformeAprendizajeEstudiante();
        nuevo.id = 0;
        nuevo.estado = 0;
        // nuevoInformesAprendizaje.idEstudiante = 0;
        return nuevo;
    }

    actualizarActividad(entidadTransporte: InformeAprendizajeEstudiante): void {
        entidadTransporte.tipo = 'e';
        this.dataService.actualizarActividad(entidadTransporte)
            .then(respuesta => {
                if (respuesta) {
                    swal(
                        'Actualización!',
                        'Su registro fue actualizado!',
                        'success'
                    );
                    this.refresh();
                } else {
                    swal(
                        'Actualización!',
                        'No se han realizado cambios!',
                        'success'
                    );
                }
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Actualización');
            });
    }

    borrarInformeAprendizaje(entidadTransporte: InformeAprendizajeEstudiante): void {
        swal({
            title: '¿Está seguro de Eliminar?',
            text: 'Se eliminarán todas las actividades asociadas',
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
                    this.dataService.borrarInformeAprendizaje(entidadTransporte.id)
                        .then(respuesta => {
                            if (respuesta) {
                                swal(
                                    'Eliminado!',
                                    'Su registro fue eliminado.',
                                    'success'
                                );
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

    borrarActividad(entidadTransporte: InformeAprendizajeEstudiante): void {
        swal({
            title: '¿Está seguro de Eliminar?',
            text: entidadTransporte.descripcion,
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
                    this.dataService.borrarActividad(entidadTransporte.id)
                        .then(respuesta => {
                            if (respuesta) {
                                swal(
                                    'Eliminado!',
                                    'Su registro fue eliminado.',
                                    'success'
                                );
                            } else {
                                this.toastr.error('Se produjo un error', 'Eliminación');
                            }
                            this.getActividadesPorInformeAprendizaje(this.idInformeAprendizaje);
                        }).catch(error => {
                        this.toastr.error('Se produjo un error', 'Eliminación');
                    });
                }
            }
        });
    }

    guardarNuevaActividad(entidadTransporte: InformeAprendizajeEstudiante): void {
        entidadTransporte.semana = this.numeroUltimaSemana;
        entidadTransporte.tipo = 'e';
        entidadTransporte.idInformeAprendizaje = this.idInformeAprendizaje;
        console.log(entidadTransporte);
        this.dataService.guardarNuevaActividad(entidadTransporte, this.flagNuevaActividad, this.personaLogeada.id)
            .then(respuesta => {
                if (respuesta) {
                    swal(
                        'Creado!',
                        'Informe de Aprendizaje creado con éxito!',
                        'success'
                    );
                    this.refresh();
                } else {
                    this.toastr.warning('Se produjo un error', 'Actualización');
                }
                this.refresh();
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Actualización');
            });
        this.cambiarFlag(true);
    }

    bloquearInformeAprendizae(): void {
        swal({
            title: '¿Está seguro de Enviar?',
            text: 'Se bloqueará el informe de aprendizaje y no podrá realizar cambios',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fa fa-check-square" aria-hidden="true"></i> Enviar Informe'
        }).then((result) => {
            if (result.value) {
                this.dataService.bloquearInformeAprendizaje(this.idInformeAprendizaje)
                    .then(respuesta => {
                        if (respuesta) {
                            swal(
                                'Enviado!',
                                'Su informe fue enviado con éxito!',
                                'success'
                            );
                            this.refresh();
                        } else {
                            this.toastr.warning('Se produjo un error', 'Actualización');
                        }
                        this.refresh();
                    })
                    .catch(error => {
                        this.toastr.warning('Se produjo un error', 'Actualización');
                    });
                this.cambiarFlag(true);
            }
        });
    }

    guardarActividad(entidadTransporte: InformeAprendizajeEstudiante): void {
        entidadTransporte.tipo = 'e';
        entidadTransporte.idInformeAprendizaje = this.idInformeAprendizaje;
        this.dataService.guardarActividad(entidadTransporte)
            .then(respuesta => {
                if (respuesta) {
                    swal(
                        'Creado!',
                        'La actividad fue creada con éxito!',
                        'success'
                    );
                    this.refresh()
                } else {
                    this.toastr.warning('Se produjo un error', 'Actualización');
                }
                this.getActividadesPorInformeAprendizaje(this.idInformeAprendizaje);
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Actualización');
            });
    }

    refresh(): void {
        this.getNumeroPaginas(this.registrosPorPagina);
        this.getInformesAprendizajePorEstudiante(this.personaLogeada.id);
        this.getActividadesPorInformeAprendizaje(this.idInformeAprendizaje);
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

    cambiarFlag(opcion) {
        switch (opcion) {
            case 'nuevo':
                this.flag = false;
                this.titulo = 'Nueva Actividad:';
                break;
            case 'actualizar':
                this.flag = false;
                this.titulo = 'Nueva Actividad:';
                break;
            case 'ver':
                this.flag = false;
                this.titulo = 'Actividades:';
                break;
            case 'regresar':
                this.flag = true;
                this.titulo = 'Informes de Aprendizaje:';
                break;
            case 'guardar':
                if (this.flagNuevaActividad) {
                    this.flag = true;
                    this.titulo = 'Informes de Aprendizaje:';
                } else {
                    this.flag = false;
                    this.titulo = 'Nueva Actividad:';
                }
                break;
        }
    }

    cambiarFlagNuevaActividad(nuevo: boolean) {
        this.flagNuevaActividad = nuevo;
        this.estadoInformeActividad = 0;
        this.actividadesInformeAprendizaje = null;
    }

    onSelect(entidadActual: InformeAprendizajeEstudiante): void {
        this.entidadSeleccionada = entidadActual;
    }
}
