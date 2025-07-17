import { Injectable, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DetectionService } from 'src/app/services/api/detection/detection.service';

@Injectable({
  providedIn: 'root'
})
export class DetectionApiResponseService {
  isLoading = false;
  error: string | null = null;

  constructor(private detectionService: DetectionService) { }

  // Returns a Promise with the combined victims and detections data
  async getVictimsWithDetections(missionId: number): Promise<any[]> {
    this.isLoading = true;
    this.error = null;

    try {
      // Get all detections for the mission
      const detectionsResponse = await this.detectionService.getDetectionsByMission(missionId).toPromise();
      const detections = detectionsResponse.detections;

      // Create requests for victims of each detection
      const victimRequests = detections.map((detection: any) =>
        this.detectionService.getVictimsByDetection(detection.id).pipe(
          map(victimsResponse => ({
            detection: detection,
            victims: victimsResponse.victims
          }))
        ));

      // Execute all requests in parallel
      const results: any = await forkJoin(victimRequests).toPromise();

      // Combine and flatten the results
      const victimsWithDetections = results.flatMap((result: any) =>
        result.victims.map((victim: any) => ({
          victim: victim,
          detection: result.detection
        }))
      );

      return victimsWithDetections;
    } catch (error) {
      console.error('Error getting victims with detections:', error);
      this.error = 'Failed to load victims with detections';
      throw error; // Re-throw to let caller handle it
    } finally {
      this.isLoading = false;
    }
  }
}