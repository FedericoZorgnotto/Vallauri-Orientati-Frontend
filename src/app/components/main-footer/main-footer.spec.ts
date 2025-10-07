import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFooter } from './main-footer';

describe('MainFooter', () => {
  let component: MainFooter;
  let fixture: ComponentFixture<MainFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
