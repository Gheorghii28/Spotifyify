import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-rename-folder',
  imports: [
    MatCardModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-rename-folder.component.html',
  styleUrl: './dialog-rename-folder.component.scss'
})
export class DialogRenameFolderComponent {
  formControl = new FormControl<string | null>('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<DialogRenameFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { folderName: string },
  ) {
    this.formControl.setValue(this.data.folderName);
  }

  public onNoClick() {
    this.dialogRef.close();
  }

  public renameFolder() {
    if (this.formControl.valid) {
      this.dialogRef.close(this.formControl.value);
    }
  }  
}
