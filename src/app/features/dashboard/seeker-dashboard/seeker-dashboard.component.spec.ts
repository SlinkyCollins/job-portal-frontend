import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerDashboardComponent } from './seeker-dashboard.component';

describe('SeekerDashboardComponent', () => {
  let component: SeekerDashboardComponent;
  let fixture: ComponentFixture<SeekerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeekerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeekerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
