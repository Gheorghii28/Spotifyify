import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveTrackComponent } from './dialog-remove-track.component';

describe('DialogRemoveTrackComponent', () => {
  let component: DialogRemoveTrackComponent;
  let fixture: ComponentFixture<DialogRemoveTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRemoveTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRemoveTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
