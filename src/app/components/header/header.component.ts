import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MissionTimerService } from 'src/app/services/mission-timer.service';
import { MissionService } from 'src/app/services/api/mission/mission.service';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';
import { VictimsStateService } from 'src/app/services/state/victims/victims-state.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, IonicModule],
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  formattedTime = '00:00';
  missionStarted = false;
  missionData: any;
  mission: any = {
    date_time_started: new Date().toISOString(), // Current time in ISO format
  }

  victimsCount: number = 0;

  constructor(
    private missionTimerService: MissionTimerService,
    private missionApiService: MissionService,
    private missionStateService: MissionStateService,
    private victimStateService: VictimsStateService,
  ) {

  }

  ngOnInit() {
    this.missionTimerService.missionStarted$.subscribe(started => {
      this.missionStarted = started;
    });

    this.missionTimerService.formattedTime$.subscribe(time => {
      this.formattedTime = time;
    });

    this.victimStateService.victimsCount$.subscribe(victimsCount => {
      this.victimsCount = victimsCount;
    })
  }


  startMission() {
    this.missionTimerService.startMission();
    this.createMission(this.mission);
  }

  endMission() {
    this.missionTimerService.stopMission();
    let mission = {
      id: this.missionData.id,
      date_time_ended: new Date().toISOString(), // Current time in ISO format
    }
    this.updateMission(mission);
  }


  getAllMissions() {
    this.missionApiService.getAllMissions().subscribe(
      data => {
        console.log('All Missions:', data);
        this.missionData = data;
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }


  getMissionById(id: string) {
    this.missionApiService.getMissionById(id).subscribe(
      data => {
        console.log('Mission Data:', data);
        this.missionData = data;
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }


  createMission(mission: any) {
    this.missionApiService.createMission(mission).subscribe(
      data => {
        console.log('Mission Created:', data);
        this.missionData = data;

        // Set the current mission in the Mission state service
        this.missionStateService.setMission(this.missionData);
        this.missionStateService.toggleStartEnd(true);
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }


  updateMission(mission: any) {
    this.missionApiService.updateMission(mission).subscribe(
      data => {
        console.log('Mission Updated:', data);
        this.missionData = data;

        // Set the current mission in the Mission state service
        this.missionStateService.setMission(this.missionData);
        this.missionStateService.toggleStartEnd(false);
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }
}


