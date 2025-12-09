import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedJobsComponent } from './saved-jobs.component';

describe('SavedJobsComponent', () => {
  let component: SavedJobsComponent;
  let fixture: ComponentFixture<SavedJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
