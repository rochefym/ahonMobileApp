import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';
import { DetectionService } from 'src/app/services/api/detection/detection.service';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';

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

  detectionRes: any;

  constructor(
    private detectionService: DetectionService,
    private missionStateService: MissionStateService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    // Subscribe to mission changes
    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });
  }

  ngOnInit() {
    // Auto-start stream on page load
    this.startStream();
  }

  ngOnDestroy() {
    this.stopStream();
    this.missionSub.unsubscribe();
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


  clickCaptureButton() {

  }


  captureDetection() {
    const detection = {
      mission_id: this.currentMission.id, // Replace with actual mission ID
      person_detection_model_id: 2, // Replace with actual model ID
      latitude: 0.0, // Replace with actual latitude
      longitude: 0.0, // Replace with actual longitude
      is_live: 'False' // Set to true for live detection
    };

    this.detectionService.captureDetection(detection).subscribe(
      response => {
        console.log('Detection captured successfully:', response);
        this.detectionRes = response;

        this.presentToast(this.detectionRes);
      },
      error => {
        console.error('Error capturing detection:', error);
      }
    );
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
          text: 'Dismiss',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
}