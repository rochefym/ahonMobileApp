import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VictimsStateService {
  private victimsCountSubject = new BehaviorSubject<any | null>(null);
  public victimsCount$ = this.victimsCountSubject.asObservable();

  constructor() { }

  // Method to set/update the Victim Count
  setVictimsCount(victimsCount: number) {
    this.victimsCountSubject.next(victimsCount);
  }

  getVictimsCount() {
    return this.victimsCountSubject.getValue();
  }
}
