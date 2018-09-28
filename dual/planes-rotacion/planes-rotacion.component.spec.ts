import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanesRotacionComponent } from './planes-rotacion.component';

describe('PlanesRotacionComponent', () => {
   let component: PlanesRotacionComponent;
   let fixture: ComponentFixture<PlanesRotacionComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ PlanesRotacionComponent ]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PlanesRotacionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
