import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobalertsComponent } from './jobalerts.component';

describe('JobalertsComponent', () => {
  let component: JobalertsComponent;
  let fixture: ComponentFixture<JobalertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobalertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobalertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
