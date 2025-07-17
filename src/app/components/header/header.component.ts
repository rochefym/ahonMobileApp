import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MissionService } from '../../services/api/mission/mission.service';
import { MissionTimerService } from '../../services/mission-timer.service';
import { VictimsStateService } from '../../services/state/victims/victims-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true, // Assuming standalone based on your project structure
  imports: [CommonModule, IonicModule],
})
export class HeaderComponent implements OnInit {
  formattedTime = '00:00';
  missionStarted = false;
  victimsCount = 0;

  constructor(
    private missionService: MissionService,
    private missionTimerService: MissionTimerService,
    private victimStateService: VictimsStateService
  ) {}

  ngOnInit() {
    // Subscribe to the current mission state to show/hide buttons
    this.missionService.currentMission$.subscribe(mission => {
      this.missionStarted = !!mission;
    });

    // Subscribe to the timer
    this.missionTimerService.formattedTime$.subscribe(time => {
      this.formattedTime = time;
    });

    // Subscribe to the victim count
    this.victimStateService.victimsCount$.subscribe(count => {
      this.victimsCount = count;
    });
  }

  startMission() {
    this.missionService.startMission().subscribe({
      next: (mission) => {
        console.log('Mission started successfully:', mission);
        this.missionTimerService.startMission();
      },
      error: (err) => {
        console.error('Failed to start mission:', err);
        // Optionally, show an error toast to the user
      },
    });
  }

  endMission() {
    this.missionService.endMission().subscribe({
      next: () => {
        console.log('Mission ended successfully.');
        this.missionTimerService.stopMission();
      },
      error: (err) => {
        console.error('Failed to end mission:', err);
        // Optionally, show an error toast to the user
      },
    });
  }
}