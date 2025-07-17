import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';
// import { JsonPipe } from '@angular/common';

import { DetectionService } from 'src/app/services/api/detection/detection.service';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';
import { VictimService } from 'src/app/services/api/victim/victim.service';
import { VictimsStateService } from 'src/app/services/state/victims/victims-state.service';
import { DetectionApiResponseService } from 'src/app/services/api/detection/detection-api-response.service';
import { MissionService, Mission } from 'src/app/services/api/mission/mission.service';

@Component({
  selector: 'app-detection-stream',
  templateUrl: './detection-stream.component.html',
  styleUrls: ['./detection-stream.component.scss'],
  imports: [IonIcon, IonButton],
  standalone: true
})
export class DetectionStreamComponent implements OnInit, OnDestroy {
  streamUrl = 'http://192.168.1.4:8000/api/detection-stream/';
  isStreaming = false;
  currentImageUrl = 'assets/placeholder.jpg';

  private missionSub!: Subscription;
  currentMission: any;
  private victimsSub!: Subscription;
  victimsCount: any;

  detectionRes: any;
  victimsRes: any;

  constructor(
    private detectionService: DetectionService,
    private missionStateService: MissionStateService,
    private missionService: MissionService,
    private victimService: VictimService,
    private victimStateService: VictimsStateService,
    private toastController: ToastController,
    private detectionApiResponseService: DetectionApiResponseService
  ) {
    // Subscribe to mission changes
    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });

    this.victimsSub = this.victimStateService.victimsCount$.subscribe(count => {
      this.victimsCount = count;
    });
  }

  ngOnInit() {
     this.missionSub = this.missionService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });

    this.victimsSub = this.victimStateService.victimsCount$.subscribe(count => {
      this.victimsCount = count;
    });
    // Auto-start stream on page load
    this.startStream();
  }

  ngOnDestroy() {
    this.stopStream();
    this.missionSub.unsubscribe();
    this.victimsSub.unsubscribe();
  }

  startStream() {
    this.isStreaming = true;
    // Add timestamp to prevent caching
    this.currentImageUrl = `${this.streamUrl}?t=${Date.now()}`;
  }

  stopStream() {
    this.isStreaming = false;
    this.currentImageUrl = 'assets/placeholder.jpg';
  }

  toggleStream() {
    if (this.isStreaming) {
      this.stopStream();
    } else {
      this.startStream();
    }
  }

  onImageError() {
    console.log('Stream connection error');
    if (this.isStreaming) {
      // Retry connection after 2 seconds
      setTimeout(() => {
        if (this.isStreaming) {
          this.currentImageUrl = `${this.streamUrl}?t=${Date.now()}`;
        }
      }, 2000);
    }
  }

  onImageLoad() {
    console.log('Stream connected successfully');
  }


  captureDetection() {
    const detection = {
      mission_id: this.currentMission.id, // Replace with actual mission ID
      person_detection_model_id: 2, // Replace with actual model ID
      latitude: 0.0, // Replace with actual latitude
      longitude: 0.0, // Replace with actual longitude
      is_live: 'False' // Set to true for live detection
    };

    this.detectionService.captureDetection(detection).subscribe({
      next: async (response) => {
        this.detectionRes = response;
        await this.getVictimsWithDetection();
        this.presentToast('Detection captured successfully!', 2000, 'top');
      },
      error: (error) => {
        console.error('Error capturing detection:', error);
        this.presentToast('Failed to capture detection.', 3000, 'top');
      }
    });
  }

  async getVictimsWithDetection() {
    this.victimsRes = await this.detectionApiResponseService.getVictimsWithDetections(this.currentMission.id);
    this.victimStateService.setVictimsCount(this.victimsRes.length);
  }

  private async presentToast(
    message: string,
    duration: number = 1000 * 10,
    position: 'top' | 'bottom' | 'middle' = 'bottom'
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
}