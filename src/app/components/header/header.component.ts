import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MissionTimerService } from 'src/app/services/mission-timer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, IonicModule],
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  missionStarted = false;
  formattedTime = '00:00';

  constructor(private missionTimerService: MissionTimerService) { }

  ngOnInit() {
    this.missionTimerService.missionStarted$.subscribe(started => {
      this.missionStarted = started;
    });

    this.missionTimerService.formattedTime$.subscribe(time => {
      this.formattedTime = time;
    });
  }

  startMission() {
    this.missionTimerService.startMission();
  }

  endMission() {
    this.missionTimerService.stopMission();
  }
}


