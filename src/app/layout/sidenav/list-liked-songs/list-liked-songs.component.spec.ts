import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLikedSongsComponent } from './list-liked-songs.component';

describe('ListLikedSongsComponent', () => {
  let component: ListLikedSongsComponent;
  let fixture: ComponentFixture<ListLikedSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLikedSongsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListLikedSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
