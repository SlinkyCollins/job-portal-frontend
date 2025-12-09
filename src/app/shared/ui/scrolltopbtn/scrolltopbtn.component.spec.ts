import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrolltopbtnComponent } from './scrolltopbtn.component';

describe('ScrolltopbtnComponent', () => {
  let component: ScrolltopbtnComponent;
  let fixture: ComponentFixture<ScrolltopbtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrolltopbtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrolltopbtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
