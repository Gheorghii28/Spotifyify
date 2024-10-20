import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangePlaylistDetailsComponent } from './dialog-change-playlist-details.component';

describe('DialogChangePlaylistDetailsComponent', () => {
  let component: DialogChangePlaylistDetailsComponent;
  let fixture: ComponentFixture<DialogChangePlaylistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChangePlaylistDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChangePlaylistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
