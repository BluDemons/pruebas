import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Tutor} from '../../../entidades/tutor';
import {TutoresService} from './tutores.service';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from 'app/entidades/periodo-lectivo';
import 'rxjs/add/operator/toPromise';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import swal from 'sweetalert2';

@Component({
    selector: 'app-tutores',
    templateUrl: './tutores.component.html',
    styleUrls: ['./tutores.component.scss']
})

export class TutoresComponent implements OnInit {
    personaLogeada: Persona;
    tutores2: Array<Tutor>;
    identificacion: string;
    tutores: Array<Tutor>;
    tutorFiltrado: Tutor;
    entidadSeleccionada: Tutor;
    periodoLectivoActual: PeriodoLectivo;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    titulo: string;
    private flag: boolean;
    private flagTutorNuevo: boolean;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
                private dataServiceDual: DualService,
                private dataService: TutoresService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        this.tutorFiltrado = new Tutor();
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.getPeriodoLectivoActual();
        this.refresh();
        this.flag = true;
        this.flagTutorNuevo = false;
        this.titulo = 'Tutores:';
    }

    getExisteTutor(): void {
        if (this.identificacion.length >= 10) {
            this.dataService
                .getExisteTutor(this.identificacion)
                .then(entidadesRecuperadas => {
                    if (entidadesRecuperadas[0].toString() === '0') {
                        this.getTutorFiltrado();
                        this.flagTutorNuevo = true;
                    } else {
                        this.toastr.success('Ya está registrado como tutor!', 'Consulta');
                        this.flagTutorNuevo = false;
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    getTutorFiltrado(): void {
        if (this.identificacion.length >= 10) {
            this.tutorFiltrado = this.crearEntidad();
            this.dataService.getTutorFiltrado(this.identificacion)
                .then(entidadesRecuperadas => {
                    if (entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡El Tutor NO se encuentra registrado!', 'Consulta');
                    } else {
                        this.tutorFiltrado = entidadesRecuperadas[0];
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    create(entidadTransporte: Tutor): void {
        console.log(entidadTransporte.primerNombre);
        console.log(entidadTransporte.segundoNombre);
        console.log(entidadTransporte.primerApellido);
        console.log(entidadTransporte.segundoApellido);
        console.log(entidadTransporte.fechaNacimiento);
        console.log(entidadTransporte.telefonoCelular);
        console.log(entidadTransporte.telefonoDomicilio);
        console.log(entidadTransporte.correoElectronicoInstitucional);
        console.log(entidadTransporte.correoElectronicoPersonal);
        console.log(entidadTransporte.idGenero);
        console.log(entidadTransporte.tipoTutor);
        entidadTransporte.identificacion = this.identificacion;
        this.dataService.create(entidadTransporte)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('La creación fue exitosa', 'Creación');
                    this.tutorFiltrado = this.crearEntidad();
                    this.identificacion = null;
                    this.flagTutorNuevo = false;
                } else {
                    this.toastr.warning('Se produjo un error', 'Creación');
                }
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Creación');
            });
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

    getTutores(): void {
        this.dataService
            .getTutores(this.paginaActual, this.registrosPorPagina)
            .then(entidadesRecuperadas => {
                console.log(entidadesRecuperadas[0]);
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                    this.tutores = null;
                } else {
                    this.tutores = entidadesRecuperadas;
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    getTutores2() {
        this.dataService.getTutores2(this.paginaActual, this.registrosPorPagina)
            .subscribe(
                (data: Tutor[]) => {
                    if (data[0].toString() !== '0') {
                        this.tutores = data;
                    } else {
                        swal({
                            position: 'center',
                            type: 'warning',
                            title: 'No hay Datos!',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                },
                err => {
                    console.log('Error');
                },
                () => {
                    console.log('Finished');
                }
            );

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
                this.titulo = 'Nuevo Tutor:';
                this.flag = false;
                this.flagTutorNuevo = false;
                this.identificacion = null;
                break;
            case 'regresar':
                this.refresh();
                this.flag = true;
                this.titulo = 'Tutores:';
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
        this.entidadSeleccionada.id = 0;
    }

    isValid(entidadPorEvaluar: Tutor): boolean {
        return true;
    }

    aceptar(): void {
        if (!this.isValid(this.entidadSeleccionada)) {
            return;
        }

        this.update(this.entidadSeleccionada);

        this.cerrarVentanaEdicion();
    }

    crearEntidad(): Tutor {
        const nuevoSeguimiento = new Tutor();
        nuevoSeguimiento.id = 0;
        nuevoSeguimiento.idGenero = 0;
        nuevoSeguimiento.tipoTutor = '0';
        return nuevoSeguimiento;
    }

    update(entidadTransporte: Tutor): void {
        this.dataService.update(entidadTransporte)
            .then(respuesta => {
                if (respuesta) {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Actualizar',
                        text: 'Actualización fue exitosa!',
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else {
                    swal({
                        position: 'center',
                        type: 'info',
                        title: 'Actualizar',
                        text: 'No se realizaron cambios',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
                this.refresh();
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Actualización 2');
            });
    }

    refresh(): void {
        this.getNumeroPaginas(this.registrosPorPagina);
        this.getTutores();
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

    onSelect(entidadActual: Tutor): void {
        this.entidadSeleccionada = entidadActual;
    }

    delete(entidadTransporte: Tutor): void {
        swal({
            title: '¿Está seguro de Eliminar?',
            text: entidadTransporte.primerApellido + ' ' + entidadTransporte.segundoNombre + ' '
            + entidadTransporte.primerNombre + ' ' + entidadTransporte.segundoNombre,
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
                                swal(
                                    'Eliminado!',
                                    'Su registro fue eliminado.',
                                    'success'
                                );
                                this.refresh();
                            } else {
                                this.toastr.error('Se produjo un error', 'Eliminación');
                            }
                        })
                        .catch(error => {
                            this.toastr.error('Se produjo un error', 'Eliminación');
                        });
                }
            }
        });
    }
}
