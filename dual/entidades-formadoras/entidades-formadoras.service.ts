import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {EntidadFormadora} from '../../../entidades/entidad-formadora';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class EntidadesFormadorasService {
    
    headers : HttpHeaders
    
    constructor(private _http: HttpClient) {
    }

    getEntidadesFormadoras(pagina: number, registrosPorPagina: number): Promise<EntidadFormadora[]> {
        const url = this.urlBase + 'leer_entidades_formadoras?' + 'pagina=' + pagina + '&registros_por_pagina=' + registrosPorPagina;
        console.log(url);
        return this._http.get(url)
            .toPromise()
            .then(response => response.json() as EntidadFormadora[])
            .catch(this.handleError);
    }

    crear(data: any,api_token:string): Observable<any> {
        const url = environment.apiUrl + 'crear';
        this.headers = new HttpHeaders().set('ApiToken',api_token);
        return this._http.post(url, JSON.stringify(data),{headers:this.headers});
    
    }

    actualizar(data: any,api_token :string): Observable<any> {
        const url = environment.apiUrl + 'actualizar';
        this.headers = new HttpHeaders().set('Api-Token',api_token)
        return this._http.pull(url, JSON.stringify(data),{headers:this.headers});
            
    }

    borrar(data: any,api_token: string): Observable<any> {
        const url = environment.apiUrl + 'borrar?id=';
        this.headers = new HttpHeaders().set('Api-Token',api_token)
        return this._http.delete(url,JSON.stringify(data),{headers:this.headers})
            
    }

    getNumeroPaginas(registrosPorPagina: number): Promise<any> {
        const url = this.urlBase + 'numero_paginas' + '?registros_por_pagina=' + registrosPorPagina;
        return this._http.get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
