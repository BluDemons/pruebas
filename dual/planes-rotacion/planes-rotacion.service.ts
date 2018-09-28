import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

import 'rxjs/add/operator/toPromise';
/* importa las entidades que vamos a utilizar en el plan rotacion*/
import {PlanMarcoFormacion} from '../../../entidades/plan-marco-formacion';
import {PlanRotacion} from '../../../entidades/plan-rotacion';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class PlanesRotacionService {
    headers : HttpHeaders
    
    constructor(private _http: HttpClient) {
    }

    /* Guarda la informacion por semanas */
    guardarSemana(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'guardar_semana';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
    }

    guardarConocimientos(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'guardar_conocimientos';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
            
    }

    /* Muestra de manera filtrada a los estudintes asignados a cada tutor */
    getEstudiantesPorTutor(idTutor): Promise<PlanMarcoFormacion[]> {
        const url = environment.apiUrl + 'leer_estudiantes_por_tutor?idTutor=' + idTutor;
        console.log(url);
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as PlanMarcoFormacion[])
            .catch(this.handleError);
    }

    bloquearPlanRotacion(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'bloquear_plan_rotacion?idPlanRotacion=';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url,JSON.stringify(data),{headers:this.headers});

    }

    /* Muestra el Plan de rotacion de cada estudiante por separado */
    getPlanRotacionPorEstudiante(idEstudiante): Promise<PlanRotacion[]> {
        const url = environment.apiUrl + 'leer_plan_rotacion_por_estudiante?idEstudiante=' + idEstudiante;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as PlanRotacion[])
            .catch(this.handleError);
    }

    /* Muestra errores */
    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
