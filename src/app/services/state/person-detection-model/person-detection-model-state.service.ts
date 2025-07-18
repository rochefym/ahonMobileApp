import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonDetectionModelStateService {
  private modelSubject = new BehaviorSubject<any | null>(null);
  public selectedModel$ = this.modelSubject.asObservable();

  constructor() { }

  setModel(selectedModel: any) {
    this.modelSubject.next(selectedModel);
  }

  getSelectedModel(): any | null {
    return this.modelSubject.value;
  }
}
