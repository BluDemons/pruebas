import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class FotoPerfilService {
    headers : HttpHeaders
    constructor(private _http: HttpClient) {
    }

    baseUrl(data: any): Observable<any>{
        const url = environment.apiUrl + '/url';
        return this._http.post(url,JSON.stringify(data));
    }

    getAll(data: any): Observable<any> {
        const url = environment.apiUrl + '/leer';
        return this._http.post(url,JSON.stringify(data)); 
    }

    getPagina(data: any): Observable<any> {
        const url = environment.apiUrl + '/leer_paginado';
        return this._http.post(url,JSON.stringify(data));
        
    }

    getFiltrado(data: any): Observable<any> {
        console.log('filtro' + data);
        const url = environment.apiUrl + '/leer_filtrado';
        return this._http.post(url,JSON.stringify(data));
            
    }

    getNumeroPaginas(data: number): Observable<any> {
        const url = environment.apiUrl + '/numero_paginas';
        return this._http.post(url,JSON.stringify(data));
    }

    get(data: any): Observable<any> {
        const url = environment.apiUrl + '/leer';
        return this._http.post(url,JSON.stringify(data));
    }

    remove(data: any, api_token:string): Observable<any> {
        const url = environment.apiUrl + '/borrar';
        this.headers = new  HttpHeaders().set('ApiToken',api_token);
        return this._http.delete(url, JSON.stringify(data),{headers:this.headers});
    }

    create(data: any,api_token:string): Observable<any> {
        const url = environment.apiUrl + '/crear';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
    }

    update(data: any,api_token:string): Observable<any> {
        const url = environment.apiUrl + '/update';
        this.headers = new HttpHeaders().set('ApiToken',api_token)
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});

    }

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
