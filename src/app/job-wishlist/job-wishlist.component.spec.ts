import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWishlistComponent } from './job-wishlist.component';

describe('JobWishlistComponent', () => {
  let component: JobWishlistComponent;
  let fixture: ComponentFixture<JobWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobWishlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
