import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action = 'Close', duration = 3000): void {
    this.snackBar.open(
      message, 
      action, 
      {
        duration
      }
    );
  }

  async runWithSnackbar<T>(
    promise: Promise<T>,
    successMsg: string
  ): Promise<T | null> {
    try {
      const result = await promise;
      this.success(successMsg);
      return result;
    } catch (error) {
      return null;
    }
  }
}
