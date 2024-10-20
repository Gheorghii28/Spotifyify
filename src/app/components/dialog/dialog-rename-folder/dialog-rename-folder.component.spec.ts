import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRenameFolderComponent } from './dialog-rename-folder.component';

describe('DialogRenameFolderComponent', () => {
  let component: DialogRenameFolderComponent;
  let fixture: ComponentFixture<DialogRenameFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRenameFolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRenameFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
