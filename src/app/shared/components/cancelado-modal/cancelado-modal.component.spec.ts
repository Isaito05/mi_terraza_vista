import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceladoModalComponent } from './cancelado-modal.component';

describe('CanceladoModalComponent', () => {
  let component: CanceladoModalComponent;
  let fixture: ComponentFixture<CanceladoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanceladoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanceladoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
