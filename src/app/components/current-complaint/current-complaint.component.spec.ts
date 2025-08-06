import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentComplaintComponent } from './current-complaint.component';

describe('CurrentComplaintComponent', () => {
  let component: CurrentComplaintComponent;
  let fixture: ComponentFixture<CurrentComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
