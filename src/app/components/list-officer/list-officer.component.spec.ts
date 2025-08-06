import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfficerComponent } from './list-officer.component';

describe('ListOfficerComponent', () => {
  let component: ListOfficerComponent;
  let fixture: ComponentFixture<ListOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfficerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
