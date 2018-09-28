import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Tutor} from '../../../entidades/tutor';

@Injectable()
export class TutoresService {
    headers: HttpHeaders
    tutores: Array<Tutor> = [];

    constructor(private _http: HttpClient) {
    }

    getTutorFiltrado(identificacion: string): Promise<Tutor> {
        const url = environment.apiUrl + 'leer_tutor_filtrado?' + 'identificacion=' + identificacion;
        console.log(url);
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as Tutor)
            .catch(this.handleError);
    }

    getExisteTutor(identificacion: string): Promise<Tutor> {
        const url = environment.apiUrl + 'leer_existe_tutor?' + 'identificacion=' + identificacion;
        console.log(url);
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as Tutor)
            .catch(this.handleError);
    }

    getTutores2(pagina: number, registrosPorPagina: number): Observable<Array<Tutor>> {
        const url = environment.apiUrl + 'leer_tutores?' + 'pagina=' + pagina + '&registros_por_pagina=' + registrosPorPagina;
        return this._http.get(url)
            .map((response) => response.json());
    }

    getTutores(pagina: number, registrosPorPagina: number): Promise<Tutor[]> {
        const url = environment.apiUrl + 'leer_tutores?' + 'pagina=' + pagina + '&registros_por_pagina=' + registrosPorPagina;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as Tutor[])
            .catch(this.handleError);
    }

    getNumeroPaginas(registrosPorPagina: number): Promise<any> {
        const url = environment.apiUrl + 'numero_paginas' + '?registros_por_pagina=' + registrosPorPagina;
        return this._http.get(url)
            .toPromise().then(response => response.json())
            .catch(this.handleError);
    }

    create(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'crear_tutor';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
        
    }

    update(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'actualizar';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});

    }

    remove(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'borrar';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        console.log('url ' + url);
        return this._http.delete(url,JSON.stringify(data),{headers:this.headers});

    }

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
