import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private movedToFolderSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  setMovedToFolderStatus(status: boolean): void {
    this.movedToFolderSubject.next(status);
  }

  observeToFolderStatus(): Observable<boolean> {
    return this.movedToFolderSubject.asObservable();
  }

  public randomString(length: number): string {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  public toJsonString(value: any): string {
    return JSON.stringify(value);
  }

  public truncateText(text: string, maxTextLength: number): string {
    if (text.length > maxTextLength) {
      return text.substring(0, maxTextLength) + '...';
    }
    return text;
  }
}
