import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancybannerComponent } from './fancybanner.component';

describe('FancybannerComponent', () => {
  let component: FancybannerComponent;
  let fixture: ComponentFixture<FancybannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FancybannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FancybannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
