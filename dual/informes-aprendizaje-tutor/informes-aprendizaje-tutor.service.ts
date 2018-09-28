import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {InformeAprendizajeTutor} from '../../../entidades/informe-aprendizaje-tutor';
import {InformeAprendizajeEstudiante} from '../../../entidades/informe-aprendizaje-estudiante';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class InformesAprendizajeTutorService {
    headers: HttpHeaders
    

    constructor(private _http: HttpClient) {
    }

    getActividadesPorInformeAprendizaje(idInformeAprendizaje): Promise<InformeAprendizajeEstudiante[]> {
        const url = environment.apiUrl + 'leer_actividades_por_informe_aprendizaje?idInformeAprendizaje=' + idInformeAprendizaje;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as InformeAprendizajeEstudiante[])
            .catch(this.handleError);
    }

    saveQualification(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'guardar_calificacion';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});

    }

    getEstudiantesPorTutor(idTutor): Promise<InformeAprendizajeTutor[]> {
        const url = environment.apiUrl + 'leer_estudiantes_por_tutor?idTutor=' + idTutor;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as InformeAprendizajeTutor[])
            .catch(this.handleError);
    }

    getInformesAprendizajePorEstudiante(idEstudiante): Promise<InformeAprendizajeTutor[]> {
        const url = environment.apiUrl + 'leer_informes_aprendizaje?idEstudiante=' + idEstudiante;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as InformeAprendizajeTutor[])
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
