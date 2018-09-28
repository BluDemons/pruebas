import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InformesAprendizajeComponent } from './informes-aprendizaje-tutor.component';

describe('InformesAprendizajeComponent', () => {
   let component: InformesAprendizajeComponent;
   let fixture: ComponentFixture<InformesAprendizajeComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ InformesAprendizajeComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(InformesAprendizajeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
