import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackNumberComponent } from './track-number.component';

describe('TrackNumberComponent', () => {
  let component: TrackNumberComponent;
  let fixture: ComponentFixture<TrackNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackNumberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
