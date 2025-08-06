import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailComplaintModalComponent } from './detail-complaint-modal.component';

describe('DetailComplaintModalComponent', () => {
  let component: DetailComplaintModalComponent;
  let fixture: ComponentFixture<DetailComplaintModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailComplaintModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailComplaintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
