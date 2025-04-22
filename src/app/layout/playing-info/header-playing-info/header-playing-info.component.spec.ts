import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPlayingInfoComponent } from './header-playing-info.component';

describe('HeaderComponent', () => {
  let component: HeaderPlayingInfoComponent;
  let fixture: ComponentFixture<HeaderPlayingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPlayingInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderPlayingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
