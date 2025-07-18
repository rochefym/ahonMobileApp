import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonDetectionModelApiService {
  baseUrl = 'http://192.168.1.4:8000/api';
  httpHeaders = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  // Updates person detection model's confidence threshold. It also sets is_selected = true and others to false  
  updatePersonDetectionModelApi(personDetectionModel: any): Observable<any> {
    const body = {
      person_detection_model_id: personDetectionModel.id,
      is_selected: true,
      confidence: personDetectionModel.confidence
    }

    return this.http.put(
      `${this.baseUrl}/person-detection-model/${personDetectionModel.id}`,
      body,
      { headers: this.httpHeaders }
    );
  }

  getAllPersonDetectionModels(): Observable<any> {
    return this.http.get(`${this.baseUrl}/person-detection-model`,
      { headers: this.httpHeaders });
  }
}
