import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerHomeComponent } from './employer-home.component';

describe('EmployerHomeComponent', () => {
  let component: EmployerHomeComponent;
  let fixture: ComponentFixture<EmployerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
