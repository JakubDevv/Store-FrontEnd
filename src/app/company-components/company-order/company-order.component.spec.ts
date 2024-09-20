import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOrderComponent } from './company-order.component';

describe('CompanyOrderComponent', () => {
  let component: CompanyOrderComponent;
  let fixture: ComponentFixture<CompanyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
