import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddTrackComponent } from './dialog-add-track.component';

describe('DialogAddTrackComponent', () => {
  let component: DialogAddTrackComponent;
  let fixture: ComponentFixture<DialogAddTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
