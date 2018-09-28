import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import 'rxjs/add/operator/toPromise';

import { RolSecundario } from '../../../entidades/rol-secundario';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class RolSecundarioService {
   headers: HttpHeaders

   constructor(private _http: HttpClient) {
   }

   baseUrl(): string {
       return environment.apiUrl;
   }

   getAll(): Promise<RolSecundario[]> {
      return this._http.get(environment.apiUrl+'/leer').toPromise().then(response=>response.json() as RolSecundario[]).catch(this.handleError);
   }

   getPagina(pagina: number, tamanoPagina: number): Promise<RolSecundario[]> {
      return this._http.get(environment.apiUrl + '/leer_paginado' + '?pagina=' + pagina + '&registros_por_pagina=' + tamanoPagina).toPromise().then(response=>response.json() as RolSecundario[]).catch(this.handleError);
   }

   getFiltrado(columna: string, tipoFiltro: string, filtro: string): Promise<RolSecundario[]> {
      return this._http.get(environment.apiUrl +'/leer_filtrado' + '?columna=' + columna + '&tipo_filtro=' + tipoFiltro + '&filtro=' + filtro).toPromise().then(response=>response.json() as RolSecundario[]).catch(this.handleError);
   }

   getNumeroPaginas(tamanoPagina: number): Promise<any> {
      return this._http.get(environment.apiUrl +'/numero_paginas' + '?registros_por_pagina=' + tamanoPagina).toPromise().then(response=>response.json()).catch(this.handleError);
   }

   get(id: number): Promise<RolSecundario> {
      const url = `${environment.apiUrl +'/leer'}?id=${id}`;
      return this._http.get(url).toPromise().then(response=>(response.json() as RolSecundario[])[0]).catch(this.handleError);
   }

   remove(data: any,api_token: string): Observable<any> {
      const url = environment.apiUrl +'/borrar';
      this.headers = new HttpHeaders().set('ApiToken',api_token);
      return this._http.delete(url,JSON.stringify(data),{headers:this.headers});
   }

   create(data: any,api_token: string): Observable<any> {
      const url = environment.apiUrl +'/crear';
      this.headers = new HttpHeaders().set('ApiToken',api_token);
      return this._http.post(url, JSON.stringify(data),{headers:this.headers});
   }
   update(data: any,api_token: string): Observable<any> {
      const url = environment.apiUrl +'/actualizar';
      this.headers = new HttpHeaders().set('ApiToken',api_token);
      return this._http.pull(url, JSON.stringify(data),{headers:this.headers});
   }

   handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
   }
}
