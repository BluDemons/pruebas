import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {PlanProyectoEmpresarial} from '../../../entidades/plan-proyecto-empresarial';
import { Observable } from 'rxjs/Observable';



@Injectable()

export class PlanesProyectoEmpresarialService {
    headers: HttpHeaders

    constructor(private _http: HttpClient) {
    }

    baseUrl(): string {
        return environment.apiUrl;
    }
    bloquearPlanProyectoEmpresarial(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/bloquear_plan_proyecto_empresarial';
        this.headers = new HttpHeaders().set('ApiTpken',api_token);
        console.log(url);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
            
    }
    getPlanProyectoEmpresarialPorEstudiante(idEstudiante): Promise<PlanProyectoEmpresarial> {
        return environment.apiUrl.get(environment.apiUrl + '/leer_plan_proyecto_empresarial_por_estudiante' + '?idEstudiante=' + idEstudiante)
            .toPromise()
            .then(response => response.json() as PlanProyectoEmpresarial)
            .catch(this.handleError);
    }

    getPlanesProyectoEmpresarial(idTutor: number, pagina: number, registrosPorPagina): Promise<PlanProyectoEmpresarial[]> {
        const url = environment.apiUrl + '/leer_planes_proyecto_empresarial' + '?idTutor=' + idTutor + '&pagina=' + pagina + '&registros_por_pagina=' + registrosPorPagina;
        console.log(url);
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as PlanProyectoEmpresarial[])
            .catch(this.handleError);
    }

    getNumeroPaginas(tamanoPagina: number): Promise<any> {
        return this._http.get(environment.apiUrl + '/numero_paginas' + '?registros_por_pagina=' + tamanoPagina)
            .toPromise().then(response => response.json()).catch(this.handleError);
    }

    create(data: any,api_token: string): Observable<any> {
        const url =environment.apiUrl + '/crear';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
        
    }

    update(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + '/actualizar';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});
    }

    remove(data: any,api_token:string): Observable<any> {
        const url = environment.apiUrl + '/borrar';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.delete(url,JSON.stringify(data),{headers:this.headers});
    }

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
