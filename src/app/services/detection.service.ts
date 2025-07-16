import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModelEndpoints {
  front: string;
  angled: string;
  top: string;
}

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private detectionCountSubject = new BehaviorSubject<number>(0);
  public detectionCount$ = this.detectionCountSubject.asObservable();

  private detectionHistorySubject = new BehaviorSubject<any[]>([]);
  public detectionHistory$ = this.detectionHistorySubject.asObservable();

  private currentModelSubject = new BehaviorSubject<'front' | 'angled' | 'top'>('front');
  public currentModel$ = this.currentModelSubject.asObservable();

  // Base URL for API calls
  private baseUrl: string = 'http://172.29.9.192:8000';

  // Model endpoints for different view angles
  private modelEndpoints: ModelEndpoints = {
    front: 'http://172.29.9.192:8000/api/detect/front',
    angled: 'http://172.29.9.192:8000/api/detect/angled',
    top: 'http://172.29.9.192:8000/api/detect/top'
  };

  // Stream endpoints for different view angles
  private streamEndpoints: ModelEndpoints = {
    front: 'http://172.29.9.192:8000/api/stream/front',
    angled: 'http://172.29.9.192:8000/api/stream/angled',
    top: 'http://172.29.9.192:8000/api/stream/top'
  };

  private confidenceThreshold: number = 70;

  constructor() { }

  updateDetectionCount(count: number) {
    this.detectionCountSubject.next(count);
  }

  getCurrentDetectionCount(): number {
    return this.detectionCountSubject.value;
  }

  addDetectionResult(result: any) {
    const currentHistory = this.detectionHistorySubject.value;
    const newHistory = [...currentHistory, result];
    this.detectionHistorySubject.next(newHistory);
  }

  resetDetection() {
    this.detectionCountSubject.next(0);
    this.detectionHistorySubject.next([]);
  }

  // Model management methods
  updateModelEndpoint(viewAngle: 'front' | 'angled' | 'top') {
    this.currentModelSubject.next(viewAngle);
    console.log(`Model endpoint updated to: ${viewAngle}`);
  }

  getCurrentModel(): 'front' | 'angled' | 'top' {
    return this.currentModelSubject.value;
  }

  getDetectionEndpoint(): string {
    const currentModel = this.currentModelSubject.value;
    return this.modelEndpoints[currentModel];
  }

  getStreamEndpoint(): string {
    const currentModel = this.currentModelSubject.value;
    return this.streamEndpoints[currentModel];
  }

  // Confidence threshold management
  updateConfidenceThreshold(threshold: number) {
    this.confidenceThreshold = threshold;
    // Send to backend API
    this.sendConfidenceToBackend(threshold);
  }

  getConfidenceThreshold(): number {
    return this.confidenceThreshold;
  }

  private async sendConfidenceToBackend(threshold: number) {
    try {
      const response = await fetch(`${this.baseUrl}/api/settings/confidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confidence_threshold: threshold / 100 }) // Convert to 0-1 range
      });
      
      if (response.ok) {
        console.log('Confidence threshold updated on backend:', threshold);
      }
    } catch (error) {
      console.error('Failed to update confidence threshold:', error);
    }
  }

  // API methods for different detection types
  async detectFromImage(imageData: FormData): Promise<any> {
    try {
      const endpoint = this.getDetectionEndpoint();
      const response = await fetch(`${endpoint}/image`, {
        method: 'POST',
        body: imageData
      });
      return await response.json();
    } catch (error) {
      console.error('Image detection failed:', error);
      throw error;
    }
  }

  async detectFromVideo(videoData: FormData): Promise<any> {
    try {
      const endpoint = this.getDetectionEndpoint();
      const response = await fetch(`${endpoint}/video`, {
        method: 'POST',
        body: videoData
      });
      return await response.json();
    } catch (error) {
      console.error('Video detection failed:', error);
      throw error;
    }
  }

  // Get model information
  getModelInfo(viewAngle: 'front' | 'angled' | 'top') {
    const modelInfo = {
      front: {
        name: 'Front/Side Detection Model',
        description: 'Optimized for front-facing and side-view person detection',
        accuracy: '94.5%',
        trainedOn: 'Front/Side view datasets'
      },
      angled: {
        name: 'Angled View Detection Model',
        description: 'Specialized for diagonal and angled perspective detection',
        accuracy: '92.8%',
        trainedOn: 'Angled view datasets'
      },
      top: {
        name: 'Top View Detection Model',
        description: 'Designed for overhead and top-down surveillance',
        accuracy: '91.2%',
        trainedOn: 'Top view datasets'
      }
    };
    return modelInfo[viewAngle];
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, forkJoin, map } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class DetectionService {
//   baseUrl = 'http://192.168.1.4:8000/api';
//   httpHeaders = { 'Content-Type': 'application/json' };

//   constructor(private http: HttpClient) { }


//   // Capture & create current detection and save to database
//   captureDetection(detection: any): Observable<any> {
//     const body = {
//       mission_id: detection.mission_id,
//       person_detection_model_id: detection.person_detection_model_id,
//       latitude: detection.latitude,
//       longitude: detection.longitude,
//       is_live: detection.is_live,
//     };

//     return this.http.post(this.baseUrl + '/capture-detection/', body,
//       { headers: this.httpHeaders });
//   }


//   getDetectionById(id: string): Observable<any> {
//     return this.http.get(this.baseUrl + '/detection/' + id + '/', { headers: this.httpHeaders });
//   }


//   getDetectionsByMission(missionId: number): Observable<any> {
//     return this.http.get(`${this.baseUrl}/mission/${missionId}/detections/`, { headers: this.httpHeaders });
//   }

//   getVictimsByDetection(detectionId: number): Observable<any> {
//     return this.http.get(`${this.baseUrl}/detection/${detectionId}/victims/`, { headers: this.httpHeaders });
//   }

// }

