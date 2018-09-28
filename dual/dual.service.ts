import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {Seguimiento} from '../../entidades/seguimiento';
import {Estudiante} from '../../entidades/estudiante';
import {EstudianteSeguimientoTutor} from '../../entidades/estudiante-seguimiento-tutor';
import {PeriodoLectivo} from '../../entidades/periodo-lectivo';
import {PlanMarcoFormacion} from '../../entidades/plan-marco-formacion';
import {PlanRotacion} from '../../entidades/plan-rotacion';
import {PlanProyectoEmpresarial} from '../../entidades/plan_proyecto_empresarial';

@Injectable()

export class DualService {
    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
    private urlBase = environment.apiUrl + 'dual';

    constructor(private http: Http) {
    }

    getAll(): Promise<Seguimiento[]> {
        return this.http.get(this.urlBase + '/leer').toPromise().then(response => response.json() as Seguimiento[]).catch(this.handleError);
    }

    getEstudiantesPorTutor(idTutor): Promise<Estudiante[]> {
        const url = this.urlBase + '/leer_estudiantes_por_tutor?idTutor=' + idTutor;
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then(response => response.json() as Estudiante[])
            .catch(this.handleError);
    }

    getPlanMarcoFormacionPorEstudiante(idEstudiante): Promise<PlanMarcoFormacion[]> {
        return this.http.get(this.urlBase + '/leer_plan_marco_formacion_por_estudiante' + '?idEstudiante=' + idEstudiante)
            .toPromise()
            .then(response => response.json() as PlanMarcoFormacion[])
            .catch(this.handleError);
    }

    getPlanRotacionPorEstudiante(idEstudiante): Promise<PlanRotacion[]> {
        return this.http.get(this.urlBase + '/leer_plan_rotacion_por_estudiante' + '?idEstudiante=' + idEstudiante)
            .toPromise()
            .then(response => response.json() as PlanRotacion[])
            .catch(this.handleError);
    }

    getPlanProyectoEmpresarialPorEstudiante(idEstudiante): Promise<PlanProyectoEmpresarial[]> {
        return this.http.get(this.urlBase + '/leer_plan_proyecto_empresarial_por_estudiante' + '?idEstudiante=' + idEstudiante)
            .toPromise()
            .then(response => response.json() as PlanProyectoEmpresarial[])
            .catch(this.handleError);
    }

    getPeriodoLectivoActual(): Promise<PeriodoLectivo> {
        return this.http.get(this.urlBase + '/leer_peorido_lectivo_actual')
            .toPromise()
            .then(response => response.json() as PeriodoLectivo)
            .catch(this.handleError);
    }

    getPeriodoLectivoTodos(): Promise<PeriodoLectivo[]> {
        const url = `${environment.apiUrl + 'seguimiento_estudiantes/leer_periodo_lectivo_todos'}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json() as PeriodoLectivo[])
            .catch(this.handleError);
    }

    /*  getPeriodoAcademico(): Promise<PeriodoAcademico> {
          const url = `${environment.apiUrl + 'periodo_lectivo_actual/consultar'}`;
          return this.http.get(url)
              .toPromise()
              .then(response => {
                  console.log(response);
                  const toReturn = (response.json() as PeriodoLectivo);
                  return toReturn;
              })
              .catch(this.handleError);
      }
  */

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
