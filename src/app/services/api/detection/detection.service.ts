import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  baseUrl = 'http://192.168.1.4:8000/api';
  httpHeaders = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }


  // Capture & create current detection and save to database
  captureDetection(detection: any): Observable<any> {
    const body = {
      mission_id: detection.mission_id,
      person_detection_model_id: detection.person_detection_model_id,
      latitude: detection.latitude,
      longitude: detection.longitude,
      is_live: detection.is_live,
    };

    return this.http.post(this.baseUrl + '/capture-detection/', body,
      { headers: this.httpHeaders });
  }


  getDetectionById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/detection/' + id + '/', { headers: this.httpHeaders });
  }


  getDetectionsByMission(missionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/mission/${missionId}/detections/`, { headers: this.httpHeaders });
  }

  getVictimsByDetection(detectionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/detection/${detectionId}/victims/`, { headers: this.httpHeaders });
  }

}
