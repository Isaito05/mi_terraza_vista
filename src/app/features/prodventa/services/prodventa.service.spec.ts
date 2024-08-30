import { TestBed } from '@angular/core/testing';

import { ProdventaService } from './prodventa.service';

describe('ProdventaService', () => {
  let service: ProdventaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdventaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
