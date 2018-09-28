import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {EntidadFormadora} from '../../../entidades/entidad-formadora';
import {EntidadesFormadorasService} from './entidades-formadoras.service';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from 'app/entidades/periodo-lectivo';
import 'rxjs/add/operator/toPromise';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import swal from 'sweetalert2';

@Component({
    selector: 'app-entidades-formadoras',
    templateUrl: './entidades-formadoras.component.html',
    styleUrls: ['./entidades-formadoras.component.scss']
})

export class EntidadesFormadorasComponent implements OnInit {
    personaLogeada: Persona;
    entidadesFormadoras: EntidadFormadora[];
    entidadSeleccionada: EntidadFormadora;
    periodoLectivoActual: PeriodoLectivo;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    flag: boolean;
    titulo: string;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
                private dataServiceDual: DualService,
                private dataService: EntidadesFormadorasService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.entidadSeleccionada = this.crearEntidad();
        this.getPeriodoLectivoActual();
        this.titulo = 'Entidades Formadoras:';
        this.refresh();
        this.flag = true;
    }

    onSelect(entidadActual: EntidadFormadora): void {
        this.entidadSeleccionada = entidadActual;
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
                this.titulo = 'Nueva Entidad Formadora:';
                break;
            case 'regresar':
                this.refresh();
                this.flag = true;
                this.titulo = 'Entidades Formadoras:';
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
    }


    isValid(entidadPorEvaluar: EntidadFormadora): boolean {
        return true;
    }

    aceptar(): void {
        if (!this.isValid(this.entidadSeleccionada)) {
            return;
        }
        this.actualizar(this.entidadSeleccionada);
        this.cerrarVentanaEdicion();
    }

    crearEntidad(): EntidadFormadora {
        const nuevo = new EntidadFormadora();
        nuevo.id = 0;
        nuevo.naturaleza = '0';
        return nuevo;
    }

    crear(entidadTransporte: EntidadFormadora): void {
        const validacion = this.validarCampos(entidadTransporte);
        console.log('validacion' + validacion);
        if (validacion === '') {
            this.dataService.crear(entidadTransporte)
                .then(respuesta => {
                    if (respuesta) {
                        this.toastr.success('La creación fue exitosa', 'Creación');
                        this.refresh();
                    } else {
                        this.toastr.error('Se produjo un error', 'Creación');
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Creación');
                });
        } else {
            this.toastr.error(validacion, 'Faltan los siguientes campos:');
        }
    }

    actualizar(entidadTransporte: EntidadFormadora): void {
        this.dataService.actualizar(entidadTransporte)
            .then(respuesta => {
                if (respuesta) {
                    this.toastr.success('La actualización fue exitosa', 'Actualización');
                } else {
                    this.toastr.error('Se produjo un error', 'Actualización 1');
                }
                this.refresh();
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Actualización 2');
            });
    }

    borrar(entidadTransporte: EntidadFormadora): void {
        swal({
            title: '¿Está seguro de Eliminar?',
            text: entidadTransporte.nombre,
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
                    this.dataService.borrar(entidadTransporte.id)
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

    refresh(): void {
        this.getNumeroPaginas(this.registrosPorPagina);
        this.getEntidadesFormadoras();
        this.entidadSeleccionada = this.crearEntidad();
    }

    validarCampos(entidadTransporte: EntidadFormadora): string {
        let errores = '';
        if (entidadTransporte.nombre === ' ' || entidadTransporte.nombre === undefined) {
            errores += 'Nombre - ';
        }
        if (entidadTransporte.naturaleza === '0' || entidadTransporte.naturaleza === undefined) {
            errores += 'Naturaleza - ';
        }
        if (entidadTransporte.representanteLegal === ' ' || entidadTransporte.representanteLegal === undefined) {
            errores += 'Representante Legal - ';
        }
        if (entidadTransporte.ruc === ' ' || entidadTransporte.ruc === undefined) {
            errores += 'R.U.C. - ';
        }
        if (entidadTransporte.correo === ' ' || entidadTransporte.correo === undefined) {
            errores += 'Correo - ';
        }
        if (entidadTransporte.actividadEconomica === ' ' || entidadTransporte.actividadEconomica === undefined) {
            errores += 'Actividad Económica - ';
        }
        if (entidadTransporte.direccion === ' ' || entidadTransporte.direccion === undefined) {
            errores += 'Dirección - ';
        }
        if (entidadTransporte.telefono === ' ' || entidadTransporte.telefono === undefined) {
            errores += 'Teléfono';
        }
        return errores;
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
}
