import { TestBed } from '@angular/core/testing';

import { AddOfficerService } from './add-officer.service';

describe('AddOfficerService', () => {
  let service: AddOfficerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddOfficerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
