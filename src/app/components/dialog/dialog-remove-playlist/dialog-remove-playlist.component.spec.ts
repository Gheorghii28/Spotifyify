import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemovePlaylistComponent } from './dialog-remove-playlist.component';

describe('DialogRemovePlaylistComponent', () => {
  let component: DialogRemovePlaylistComponent;
  let fixture: ComponentFixture<DialogRemovePlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRemovePlaylistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRemovePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
