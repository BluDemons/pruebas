import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {SeguimientoTutor} from '../../../entidades/seguimiento-tutor';
import {InformeAprendizajeTutor} from '../../../entidades/informe-aprendizaje-tutor';
import {SeguimientoTutorService} from './seguimiento-tutor.service';
import 'rxjs/add/operator/toPromise';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DualService} from '../dual.service';
import {PeriodoLectivo} from '../../../entidades/periodo-lectivo';
import {LoginResult} from '../../../entidades/login-result';
import {Persona} from '../../../entidades/persona';
import {NgbModalOptions} from '@ng-bootstrap/ng-bootstrap/modal/modal';
import {PlanMarcoFormacion} from '../../../entidades/plan-marco-formacion';
import {PlanRotacion} from '../../../entidades/plan-rotacion';
import {PlanProyectoEmpresarial} from '../../../entidades/plan_proyecto_empresarial';
import {FotoPerfilService} from '../foto-perfil/foto-perfil.service';


@Component({
    selector: 'app-seguimiento-tutor',
    templateUrl: './seguimiento-tutor.component.html',
    styleUrls: ['./seguimiento-tutor.component.scss']
})

export class SeguimientoTutorComponent implements OnInit {
    personaLogeada: Persona;
    busy: Promise<any>;
    srcFoto: string;
    fotoNombre: string;
    fotoType: string;
    fotoFile: string;
    entidades: SeguimientoTutor[];
    planProyectoEmpresarial: PlanProyectoEmpresarial[];
    planMarcoFormacion: PlanMarcoFormacion[];
    planRotacion: PlanRotacion[];
    informesAprendizaje: InformeAprendizajeTutor[];
    estudiantes: InformeAprendizajeTutor[];
    entidadSeleccionada: SeguimientoTutor;
    periodoLectivoActual: PeriodoLectivo;
    pagina: 1;
    tamanoPagina: 20;
    paginaActual: number;
    paginaUltima: number;
    registrosPorPagina: number;
    esVisibleVentanaEdicion: boolean;
    flag: boolean;
    flagGrid: boolean;

    constructor(public toastr: ToastsManager,
                vcr: ViewContainerRef,
                private dataService: SeguimientoTutorService,
                private fotoPerfilDataService: FotoPerfilService,
                private dataDualService: DualService,
                private modalService: NgbModal) {
        this.toastr.setRootViewContainerRef(vcr);
    }


    ngOnInit() {
        this.entidades = SeguimientoTutor[0];
        this.entidadSeleccionada = this.crearEntidad();
        this.paginaActual = 1;
        this.registrosPorPagina = 5;
        const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.getEstudiantesPorTutor(this.personaLogeada.id);
        this.getPeriodoLectivoActual();
        this.flag = true;
        this.flagGrid = true;
    }

    openInformesAprendizaje(content, prioridad, idEstudiante) {
        const logoutScreenOptions: NgbModalOptions = {
            size: 'lg'
        };
        this.modalService.open(content, logoutScreenOptions);
        this.getInformesAprendizajePorEstudiante(idEstudiante, prioridad)
    }

    openPlanMarcoFormacion(content, idEstudiante) {
        const logoutScreenOptions: NgbModalOptions = {
            size: 'lg'
        };
        this.modalService.open(content, logoutScreenOptions);
        this.getPlanMarcoFormacionPorEstudiante(idEstudiante)
    }

    openPlanRotacion(content, idEstudiante) {
        const logoutScreenOptions: NgbModalOptions = {
            size: 'lg'
        };
        this.modalService.open(content, logoutScreenOptions);
        this.getPlanRotacionPorEstudiante(idEstudiante)
    }

    openPlanProyectoEmpresarial(content, idEstudiante) {
        const logoutScreenOptions: NgbModalOptions = {
            size: 'lg'
        };
        this.modalService.open(content, logoutScreenOptions);
        this.getPlanProyectoEmpresarialPorEstudiante(idEstudiante);
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

    getEstudiantesPorTutor(idTutor): void {
        let i = 0;
        this.busy = this.dataService
            .getEstudiantesPorTutor(idTutor)
            .then(entidadesRecuperadas => {
                if (entidadesRecuperadas[0].toString() === '0') {
                    this.toastr.warning('¡No hay datos!', 'Consulta');
                } else {
                    this.estudiantes = entidadesRecuperadas;
                    this.estudiantes.forEach(value => {
                        this.fotoFile = value.adjunto;
                        this.fotoType = value.tipoArchivo;

                        if (this.fotoFile != null) {
                            this.estudiantes[i].srcFoto = 'data:' + this.fotoType + ';base64,' + this.fotoFile;
                        } else {
                            this.estudiantes[i].srcFoto = './../../../../assets/images/user.png';
                        }
                        i++;
                    });
                }
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    getInformesAprendizajePorEstudiante(idEstudiante, prioridad): void {
        if (!(idEstudiante === undefined || idEstudiante === 0 || idEstudiante == null)) {
            this.busy = this.dataService
                .getInformesAprendizajePorEstudiante(idEstudiante, prioridad)
                .then(entidadesRecuperadas => {
                    if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.informesAprendizaje = entidadesRecuperadas
                    } else {
                        this.informesAprendizaje = entidadesRecuperadas
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    getPlanMarcoFormacionPorEstudiante(idEstudiante): void {
        if (!(idEstudiante === undefined || idEstudiante === 0 || idEstudiante == null)) {
            this.busy = this.dataDualService
                .getPlanMarcoFormacionPorEstudiante(idEstudiante)
                .then(entidadesRecuperadas => {
                    if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.planMarcoFormacion = entidadesRecuperadas
                    } else {
                        this.planMarcoFormacion = entidadesRecuperadas;
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    getPlanRotacionPorEstudiante(idEstudiante): void {
        if (!(idEstudiante === undefined || idEstudiante === 0 || idEstudiante == null)) {
            this.busy = this.dataDualService
                .getPlanRotacionPorEstudiante(idEstudiante)
                .then(entidadesRecuperadas => {
                    if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.planRotacion = entidadesRecuperadas
                    } else {
                        this.planRotacion = entidadesRecuperadas;
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    getPlanProyectoEmpresarialPorEstudiante(idEstudiante): void {
        if (!(idEstudiante === undefined || idEstudiante === 0 || idEstudiante == null)) {
            this.busy = this.dataDualService
                .getPlanProyectoEmpresarialPorEstudiante(idEstudiante)
                .then(entidadesRecuperadas => {
                    if (entidadesRecuperadas == null || entidadesRecuperadas[0].toString() === '0') {
                        this.toastr.warning('¡No hay datos!', 'Consulta');
                        this.planProyectoEmpresarial = entidadesRecuperadas
                    } else {
                        this.planProyectoEmpresarial = entidadesRecuperadas;
                    }
                })
                .catch(error => {
                    this.toastr.error('Se produjo un error', 'Consulta');
                });
        }
    }

    getPeriodoLectivoActual(): void {
        this.busy = this.dataDualService
            .getPeriodoLectivoActual()
            .then(entidadesRecuperadas => {
                this.periodoLectivoActual = entidadesRecuperadas
            })
            .catch(error => {
                this.toastr.error('Se produjo un error', 'Consulta');
            });
    }

    getNumeroPaginas(tamanoPagina: number): void {
        this.busy = this.dataService
            .getNumeroPaginas(tamanoPagina)
            .then(respuesta => {
                this.paginaUltima = respuesta.paginas;
            })
            .catch(error => {
                // Error al leer las paginas
            });
    }

    isValid(entidadPorEvaluar: SeguimientoTutor): boolean {
        return true;
    }

    aceptar(): void {
        this.cerrarVentanaEdicion();
    }

    crearEntidad(): SeguimientoTutor {
        const nuevoInformesAprendizaje = new SeguimientoTutor();
        nuevoInformesAprendizaje.id = 0;
        nuevoInformesAprendizaje.idEstudiante = 0;
        return nuevoInformesAprendizaje;
    }

    refresh(): void {
        this.getNumeroPaginas(this.registrosPorPagina);
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


    onSelect(entidadActual: SeguimientoTutor): void {
        this.entidadSeleccionada = entidadActual;
    }
}
