import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnFullScreenComponent } from './btn-full-screen.component';

describe('BtnFullScreenComponent', () => {
  let component: BtnFullScreenComponent;
  let fixture: ComponentFixture<BtnFullScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnFullScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnFullScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
