import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class ReportesService {
    
    hearders: HttpHeaders
    
    constructor(private _http: HttpClient) {
    }

    getEntidadesFormadoras(data: any,api_token:string): Observable<any> {
        const url = environment.apiUrl + 'leer_entidades_formadoras?';
        this.hearders = new HttpHeaders().set('ApiToken',api_token);
        console.log(url);
        return this._http.post(url,JSON.stringify(data),{headers:this.hearders});
            
    }

    handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
