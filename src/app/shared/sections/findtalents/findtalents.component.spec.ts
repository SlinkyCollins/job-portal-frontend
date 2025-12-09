import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindtalentsComponent } from './findtalents.component';

describe('FindtalentsComponent', () => {
  let component: FindtalentsComponent;
  let fixture: ComponentFixture<FindtalentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindtalentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindtalentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
