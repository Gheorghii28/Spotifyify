import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundwaveComponent } from './soundwave.component';

describe('SoundwaveComponent', () => {
  let component: SoundwaveComponent;
  let fixture: ComponentFixture<SoundwaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundwaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoundwaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
