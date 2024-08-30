import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdventaComponent } from './prodventa.component';

describe('ProdventaComponent', () => {
  let component: ProdventaComponent;
  let fixture: ComponentFixture<ProdventaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProdventaComponent]
    });
    fixture = TestBed.createComponent(ProdventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
