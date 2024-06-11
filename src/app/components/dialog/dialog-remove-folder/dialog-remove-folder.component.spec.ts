import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemoveFolderComponent } from './dialog-remove-folder.component';

describe('DialogRemoveFolderComponent', () => {
  let component: DialogRemoveFolderComponent;
  let fixture: ComponentFixture<DialogRemoveFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRemoveFolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRemoveFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
