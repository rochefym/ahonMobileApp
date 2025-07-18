import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MissionService {
  baseUrl = 'http://192.168.1.4:8000/api';
  httpHeaders = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  getAllMissions(): Observable<any> {
    return this.http.get(this.baseUrl + '/missions/',
      { headers: this.httpHeaders });
  }

  getMissionById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/mission/' + id + '/',
      { headers: this.httpHeaders });
  }

  // Updates the mission object with the end time
  updateMission(mission: any): Observable<any> {
    const body = {
      date_time_ended: mission.date_time_ended
    };

    return this.http.put(this.baseUrl + '/mission/' + mission.id + '/', body,
      { headers: this.httpHeaders });
  }


  createMission(mission: any): Observable<any> {
    const body = {
      date_time_started: mission.date_time_started
    };

    return this.http.post(this.baseUrl + '/missions/', body,
      { headers: this.httpHeaders });
  }

}
