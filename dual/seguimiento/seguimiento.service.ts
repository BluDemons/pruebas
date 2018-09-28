import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {Seguimiento} from '../../../entidades/seguimiento';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class SeguimientoService {
    headers: HttpHeaders
    
    constructor(private _http: HttpClient) {
    }

    getSeguimientoEstudiantesActual(pagina: number, tamanoPagina: number): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_actual?' + 'pagina=' + pagina + '&registros_por_pagina=' + tamanoPagina)
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoEstudiantesPorPeriodo(pagina: number, tamanoPagina: number, idPeriodoLectivo: number): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_por_periodo?' + 'pagina=' + pagina + '&registros_por_pagina='
            + tamanoPagina + '&idPeriodoLectivo=' + idPeriodoLectivo)
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoEstudiantesTodos(pagina: number, tamanoPagina: number): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_todos')
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoEstudiantesFiltrado(parametroBusqueda: string): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_estudiante?parametroBusqueda=' + parametroBusqueda)
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoTutoresAcademicos(): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_tutor_academico')
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoTutoresGenerales(): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_tutor_general')
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoTutoresEspecificos(): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_tutor_especifico')
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoPeriodosAcademicos(): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_periodo_academico')
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getSeguimientoEntidadesFormadoras(): Promise<Seguimiento[]> {
        return this._http.get(environment.apiUrl + '/leer_seguimiento_entidades_formadoras')
            .toPromise()
            .then(response => response.json() as Seguimiento[])
            .catch(this.handleError);
    }

    getNumeroPaginas(tamanoPagina: number): Promise<any> {
        return this._http.get(environment.apiUrl + '/numero_paginas' + '?registros_por_pagina=' + tamanoPagina)
            .toPromise().then(response => response.json()).catch(this.handleError);
    }

    create(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/crear';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
    }

    update(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/actualizar';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});
    }

    remove(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/borrar';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        console.log('url ' + url);
        return this._http.delete(url,JSON.stringify(data),{headers:this.headers});
    }

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
