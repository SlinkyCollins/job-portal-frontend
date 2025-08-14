import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiepolicyComponent } from './cookiepolicy.component';

describe('CookiepolicyComponent', () => {
  let component: CookiepolicyComponent;
  let fixture: ComponentFixture<CookiepolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiepolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiepolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
