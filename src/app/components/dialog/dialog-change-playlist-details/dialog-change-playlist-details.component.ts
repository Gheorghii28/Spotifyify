import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogChangePlaylistDetailsData } from '../../../models/dialog.model';

@Component({
  selector: 'app-dialog-change-playlist-details',
  imports: [
    MatCardModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-change-playlist-details.component.html',
  styleUrl: './dialog-change-playlist-details.component.scss'
})
export class DialogChangePlaylistDetailsComponent {
  nameControl = new FormControl<string | null>('', Validators.required);
  descriptionControl = new FormControl<string | null>('');

  constructor(
    public dialogRef: MatDialogRef<DialogChangePlaylistDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogChangePlaylistDetailsData,
  ) {
    this.nameControl.setValue(this.data.name);
    this.descriptionControl.setValue(this.data.description);
  }

  public onNoClick() {
    this.dialogRef.close();
  }

  public changePlaylistDetails() {
    if (this.nameControl.valid) {
      const updatedDetails = {
        id: this.data.id,
        name: this.nameControl.value?.trim(),
        description: this.descriptionControl.value?.trim()
      };
      this.dialogRef.close(updatedDetails);
    }
  }  
}
