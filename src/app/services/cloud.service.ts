import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CloudFiles } from '../models/cloud.model';

@Injectable({
  providedIn: 'root',
})
export class CloudService {
  private files!: CloudFiles;
  private files$: BehaviorSubject<any> = new BehaviorSubject(this.files);

  getFiles(): Observable<any> {
    return this.files$.asObservable();
  }

  setFiles(newFiles: CloudFiles): void {
    this.files$.next(newFiles);
  }
}
