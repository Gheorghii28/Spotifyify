import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnFollowComponent } from './btn-follow.component';

describe('BtnFollowComponent', () => {
  let component: BtnFollowComponent;
  let fixture: ComponentFixture<BtnFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnFollowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
