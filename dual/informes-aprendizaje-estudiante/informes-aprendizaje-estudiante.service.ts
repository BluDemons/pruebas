import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {InformeAprendizajeEstudiante} from '../../../entidades/informe-aprendizaje-estudiante';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class InformesAprendizajeEstudianteService {
    
    headers: HttpHeaders
    
    constructor(private _http: HttpClient) {
    }

    guardarNuevaActividad(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'guardar_actividad';
        this.headers = new HttpHeaders().set('Api-Token',api_token);
        console.log(url);
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});
        
    }

    bloquearInformeAprendizaje(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/bloquear_informe_aprendizaje';
        this.headers = new HttpHeaders().set('Api-Token',api_token);
        return this._http.post(url,JSON.stringify(data),{headers:this.headers});
            
    }

    borrarActividad(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/borrar_actividad?';
        this.headers = new HttpHeaders().set('Api-Token',api_token);
        return this._http.delete(url,JSON.stringify(data),{headers:this.headers});
            
    }

    borrarInformeAprendizaje(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/borrar_informe_aprendizaje?idInformeAprendizaje=';
        this.headers = new HttpHeaders().set('Api-Token',api_token);
        return this._http.delete(url,JSON.stringify(data),{headers:this.headers});
            
    }

    actualizarActividad(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/actualizar_actividad';
        this.headers = new HttpHeaders().set('Api-Token',api_token);
        return this._http.pull(url,JSON.stringify(data),{headers:this.headers})
            
    }

    guardarActividad(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/guardar_actividad';
        this.headers = new HttpHeaders().set('Api-Token',api_token);
        return this._http.pull(url,JSON.stringify(data),{headers:this.headers});
            
    }

    getEstudiantesPorTutor(data:any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/leer_estudiantes_por_tutor?idTutor='
        this.headers = new  HttpHeaders().set('ApiToken',api_token);
        return this._http.get(url,JSON.stringify(data),{headers:this.headers});
            
    }

    getInformesAprendizajePorEstudiante(idPersona): Promise<InformeAprendizajeEstudiante[]> {
        return this._http.get(this.urlBase + '/leer_informes_aprendizaje?idPersona=' + idPersona)
            .toPromise()
            .then(response => response.json() as InformeAprendizajeEstudiante[])
            .catch(this.handleError);
    }

    getActividadesPorInformeAprendizaje(idInformeAprendizaje): Promise<InformeAprendizajeEstudiante[]> {
        return this._http.get(this.urlBase + '/leer_actividades_por_informe_aprendizaje?idInformeAprendizaje=' + idInformeAprendizaje)
            .toPromise()
            .then(response => response.json() as InformeAprendizajeEstudiante[])
            .catch(this.handleError);
    }

    getNumeroPaginas(tamanoPagina: number): Promise<any> {
        return this._http.get(this.urlBase + '/numero_paginas' + '?registros_por_pagina=' + tamanoPagina)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getNumeroUltimaSemana(idPlanMarcoFormacion: number): Promise<InformeAprendizajeEstudiante[]> {
        const url = this.urlBase + '/leer_numero_ultima_semana' + '?idPlanMarcoFormacion=' + idPlanMarcoFormacion;
        return this._http.get(url)
            .toPromise()
            .then(response => (response.json() as InformeAprendizajeEstudiante[]))
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
