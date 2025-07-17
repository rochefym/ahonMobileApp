import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * This interface should match the data structure for a single mission
 * returned by your backend API.
 */
export interface Mission {
  id: number;
  mission_id_str: string; // e.g., MSN001
  status: 'Completed' | 'Aborted' | 'In Progress';
  date_time_started: string;
  date_time_ended?: string;
  duration: string;
  detection_model: 'Front' | 'Angled' | 'Top';
  confidence_threshold: number;
  total_detections: number;
  average_confidence: number;
  temperature_range: string;
  victims_found: number;
  victims: Victim[];
}

export interface Victim {
  id: number;
  victim_id_str: string; // e.g., V001
  status: 'Stable' | 'Critical' | 'Unknown';
  temperature: number;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  // Using the IP address from your detection.service.ts for consistency
  private baseUrl = 'http://172.29.9.192:8000/api';

  // Holds the currently active mission object. Starts as null.
  private currentMissionSubject = new BehaviorSubject<Mission | null>(null);
  public currentMission$ = this.currentMissionSubject.asObservable();

  // Holds the list of all past missions for the history page.
  private missionHistorySubject = new BehaviorSubject<Mission[]>([]);
  public missionHistory$ = this.missionHistorySubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Public accessor to get the current mission's value synchronously.
   * Your partner's pages can use this to get the mission ID instantly.
   * Example usage: this.missionService.currentMissionValue?.id
   */
  public get currentMissionValue(): Mission | null {
    return this.currentMissionSubject.value;
  }

  /**
   * Fetches all missions from the backend and updates the history subject.
   * This should be called when the app loads and after a mission ends.
   */
  loadMissionHistory(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.baseUrl}/missions/`).pipe(
      tap(missions => {
        this.missionHistorySubject.next(missions);
      }),
      catchError(err => {
        console.error('Failed to load mission history', err);
        return throwError(() => new Error('Failed to load mission history'));
      })
    );
  }

  /**
   * Starts a new mission by calling the backend.
   * The new mission returned from the backend is set as the current mission.
   */
  startMission(): Observable<Mission> {
    const body = {
      date_time_started: new Date().toISOString()
    };
    return this.http.post<Mission>(`${this.baseUrl}/missions/`, body).pipe(
      tap(newMission => {
        this.currentMissionSubject.next(newMission);
      }),
      catchError(err => {
        console.error('Failed to start mission', err);
        return throwError(() => new Error('Failed to start mission'));
      })
    );
  }

  /**
   * Ends the currently active mission by updating it on the backend.
   */
  endMission(): Observable<any> {
    const currentMission = this.currentMissionValue;
    if (!currentMission) {
      return throwError(() => new Error('No active mission to end.'));
    }

    const body = {
      date_time_ended: new Date().toISOString()
    };

    return this.http.put(`${this.baseUrl}/mission/${currentMission.id}/`, body).pipe(
      tap(() => {
        this.currentMissionSubject.next(null); // Clear the current mission
        this.loadMissionHistory().subscribe(); // Refresh the history list
      }),
      catchError(err => {
        console.error('Failed to end mission', err);
        return throwError(() => new Error('Failed to end mission'));
      })
    );
  }

  /**
   * Deletes a mission from the backend.
   */
  deleteMission(missionId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/mission/${missionId}/`).pipe(
      tap(() => {
        // After deleting, reload the history to reflect the change
        this.loadMissionHistory().subscribe();
      }),
      catchError(err => {
        console.error(`Failed to delete mission ${missionId}`, err);
        return throwError(() => new Error('Failed to delete mission'));
      })
    );
  }
}