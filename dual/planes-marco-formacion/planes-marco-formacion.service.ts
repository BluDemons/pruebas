import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {PlanMarcoFormacion} from '../../../entidades/plan-marco-formacion';
import {Objetivo} from '../../../entidades/objetivo';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class PlanesMarcoFormacionService {
    headers: HttpHeaders

    constructor(private _http: HttpClient) {
    }

    // Obtiene los estudiantes de acuerdo al tutor
    getEstudiantesPorTutor(idTutor): Promise<PlanMarcoFormacion[]> {
        const url = environment.apiUrl + 'leer_estudiantes_por_tutor?idTutor=' + idTutor;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as PlanMarcoFormacion[])
            .catch(this.handleError);
    }

    // Obtiene el plan marco de formacion con sus objetivos respectivos de acuerdo al estudiante
    getPlanMarcoFormacionPorEstudiante(idEstudiante): Promise<PlanMarcoFormacion[]> {
        const url = environment.apiUrl + 'leer_plan_marco_formacion_por_estudiante?idEstudiante=' + idEstudiante;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as PlanMarcoFormacion[])
            .catch(this.handleError);
    }

    // Guarda el objetivo del plan marco de formacion
    guardarObjetivo(entidadTransporte: Objetivo, idEstudiante: number, idPeriodoLectivo: number): Promise<boolean> {
        const url = environment.apiUrl + 'guardar_objetivo?idEstudiante=' + idEstudiante + '&idPeriodoLectivo=' + idPeriodoLectivo;
        console.log(url);
        return this._http.post(url, JSON.stringify(entidadTransporte))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // Cambia la prioridad del plan marco de formacion y de los objetivos poniendoles con valor 1
    bloquearPlanMarcoFormacion(entidadTransporte: PlanMarcoFormacion): Promise<boolean> {
        const url = environment.apiUrl + 'bloquear_plan_marco_formacion';
        return this._http.post(url, JSON.stringify(entidadTransporte))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // Actualiza el objetivo del plan marco de formacion
    updateObjective(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'actualizar_objetivo';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});
            
    }

    updateAchievementlevelachieved(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'actualizar_nivel_logro_alcanzado';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});
           
    }

    // Borra el objetivo del plan marco de formacion
    deleteObjective(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'borrar_objetivo';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.delete(url,JSON.stringify(data),{headers:this.headers});
    }

    // Retorna el error generdo en las funciones del service
    handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
