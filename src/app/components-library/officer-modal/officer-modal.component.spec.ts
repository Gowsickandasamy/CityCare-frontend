import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerModalComponent } from './officer-modal.component';

describe('OfficerModalComponent', () => {
  let component: OfficerModalComponent;
  let fixture: ComponentFixture<OfficerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
