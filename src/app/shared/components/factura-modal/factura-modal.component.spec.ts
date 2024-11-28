import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaModalComponent } from './factura-modal.component';

describe('FacturaModalComponent', () => {
  let component: FacturaModalComponent;
  let fixture: ComponentFixture<FacturaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
