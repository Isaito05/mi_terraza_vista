import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoEditModalComponent } from './carrito-edit-modal.component';

describe('CarrittoEditModalComponent', () => {
  let component: CarritoEditModalComponent;
  let fixture: ComponentFixture<CarritoEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarritoEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
