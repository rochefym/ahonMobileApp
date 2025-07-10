import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { IonButton, IonIcon, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-mission-timer',
  templateUrl: './mission-timer.component.html',
  styleUrls: ['./mission-timer.component.scss'],
  imports: [IonText, IonIcon, IonButton]
})
export class MissionTimerComponent implements OnDestroy {

  formattedTime: string = '00:00';
  timePassed: number = 0;
  private timerSubscription!: Subscription;
  isRunning: boolean = false;

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;

      //timerSubscription subscribes to changes in the variables timePassed and formatTime every 1000 milliseconds (or 1 second)
      this.timerSubscription = interval(1000).subscribe(() => {
        this.timePassed++;
        this.formatTime(this.timePassed);
      });
    }
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.isRunning = false;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.timePassed = 0;
    this.formatTime(this.timePassed);
  }

  formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.formattedTime = `${this.pad(mins)}:${this.pad(secs)}`;
  }

  pad(val: number): string {
    return val < 10 ? '0' + val : val.toString();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

}
