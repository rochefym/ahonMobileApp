import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VictimService {
  baseUrl = 'http://192.168.1.4:8000/api';
  httpHeaders = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  getVictimsByMission(missionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/mission/${missionId}/victims/`, { headers: this.httpHeaders });
  }

}
