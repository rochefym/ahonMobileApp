import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetectionService } from 'src/app/services/api/detection/detection.service';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { forkJoin, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';

@Component({
  selector: 'app-victims',
  templateUrl: './victims.page.html',
  styleUrls: ['./victims.page.scss'],
  standalone: false
})
export class VictimsPage implements OnInit, OnDestroy {
  detectionsWithVictims: any[] = [];
  victimsWithDetections: any[] = [];

  filtering: string = 'allVictims'

  private missionSub!: Subscription;
  currentMission: any;

  isLoading = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private detectionService: DetectionService,
    private missionStateService: MissionStateService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {

  }

  async ngOnInit() {
    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });
    await this.loadData(Number(this.currentMission.id));
  }

  ngOnDestroy() {
    this.missionSub.unsubscribe();
  }

  detectionRes: any;
  detectionResToJSONString: any;
  detectionRes2: any;
  detectionResToJSONString2: any;

  getDetectionsByMission(missionId: number) {
    this.detectionService.getDetectionsByMission(missionId).subscribe(
      response => {
        this.detectionRes2 = response;
        this.detectionResToJSONString2 = JSON.stringify(response);

        return JSON.stringify(response);
      },
      error => {
        console.error('Error getting detection:', error);
      }
    );
  }


  getVictimsByDetection(detectionId: number) {
    this.detectionService.getVictimsByDetection(detectionId).subscribe(
      response => {
        this.detectionRes = response;
        this.detectionResToJSONString = JSON.stringify(response);

        return this.detectionResToJSONString;
      },
      error => {
        console.error('Error getting victims:', error);
      }
    );
  }


  async loadData(missionId: number) {
    this.isLoading = true;
    try {
      await this.getVictimsWithDetections(missionId);
      // await this.getDetectionsWithVictims(missionId);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Get all Detection Objects by their Mission ID and put all the Victims in their corresponding Detection
  async getDetectionsWithVictims(missionId: number): Promise<void> {
    try {
      this.loading = true;

      // First, get all detections for the mission
      const detectionsResponse = await this.detectionService.getDetectionsByMission(missionId).toPromise();
      const detections = detectionsResponse.detections;

      // Create an array for getting victims for each detection
      const victimRequests = detections.map((detection: any) =>
        this.detectionService.getVictimsByDetection(detection.id).pipe(
          map(victimsResponse => ({
            detection: detection,
            victims: victimsResponse.victims
          }))
        )
      );

      // Execute all victim requests in parallel
      const results = await forkJoin(victimRequests).toPromise() as any[];

      this.detectionsWithVictims = results;
      console.log('Detections with victims:', this.detectionsWithVictims);

    } catch (error) {
      console.error('Error getting detections with victims:', error);
      this.error = 'Failed to load detections with victims';
    } finally {
      this.loading = false;
    }
  }


  // Get all Victim Objects by their Mission ID and put all the Detection info in their corresponding Victim
  async getVictimsWithDetections(missionId: number): Promise<void> {
    try {
      this.loading = true;

      // First, get all detections for the mission
      const detectionsResponse = await this.detectionService.getDetectionsByMission(missionId).toPromise();
      const detections = detectionsResponse.detections;

      // Create an array for getting victims for each detection
      const victimRequests = detections.map((detection: any) =>
        this.detectionService.getVictimsByDetection(detection.id).pipe(
          map(victimsResponse => ({
            detection: detection,
            victims: victimsResponse.victims
          }))
        )
      );

      // Execute all victim requests in parallel
      const results = await forkJoin(victimRequests).toPromise() as any[];

      // Flatten the structure to focus on victims with their detection data
      this.victimsWithDetections = [];
      results.forEach(result => {
        result.victims.forEach((victim: any) => {
          this.victimsWithDetections.push({
            victim: victim,
            detection: result.detection
          });
        });
      });

      console.log('Victims with detections:', this.victimsWithDetections);

    } catch (error) {
      console.error('Error getting victims with detections:', error);
      this.error = 'Failed to load victims with detections';
    } finally {
      this.loading = false;
    }
  }
}
