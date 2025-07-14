import { Injectable } from '@angular/core';
import { Mission, Victim } from '../pages/tabs/history/history.page';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private missions: Mission[] = [];

  constructor() {
    this.initializeMockData();
  }

  getMissions(): Mission[] {
    return [...this.missions];
  }

  addMission(mission: Mission) {
    this.missions.unshift(mission); // Add to beginning for chronological order
    this.saveMissions();
  }

  deleteMission(missionId: string) {
    this.missions = this.missions.filter(m => m.id !== missionId);
    this.saveMissions();
  }

  updateMissionStatus(missionId: string, status: Mission['status']) {
    const mission = this.missions.find(m => m.id === missionId);
    if (mission) {
      mission.status = status;
      this.saveMissions();
    }
  }

  // Backend integration methods (ready for implementation)
  async syncWithBackend(): Promise<void> {
    try {
      // TODO: Implement API call to sync missions
      const response = await fetch('/api/missions');
      const missions = await response.json();
      this.missions = missions;
      this.saveMissions();
    } catch (error) {
      console.error('Failed to sync missions:', error);
    }
  }

  async uploadMissionToBackend(mission: Mission): Promise<void> {
    try {
      // TODO: Implement API call to upload mission
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mission)
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload mission');
      }
    } catch (error) {
      console.error('Failed to upload mission:', error);
      throw error;
    }
  }

  private initializeMockData() {
    // Mock data for development - remove when connecting to backend
    this.missions = [
      {
        id: 'MSN001',
        date: new Date('2024-01-15T10:30:00'),
        duration: '2h 15m',
        status: 'Completed',
        victimsFound: 3,
        totalDetections: 8,
        avgConfidence: 87,
        confidenceThreshold: 70,
        model: 'front',
        tempRange: '35.2°C - 37.8°C',
        victims: [
          {
            id: 'V001',
            status: 'Stable',
            bodyTemp: 36.5,
            confidence: 92,
            coordinates: '40.7128°N, 74.0060°W',
            detectionTime: new Date('2024-01-15T10:45:00')
          },
          {
            id: 'V002',
            status: 'Critical',
            bodyTemp: 35.2,
            confidence: 85,
            coordinates: '40.7130°N, 74.0058°W',
            detectionTime: new Date('2024-01-15T11:20:00')
          }
        ]
      },
      {
        id: 'MSN002',
        date: new Date('2024-01-14T14:15:00'),
        duration: '1h 45m',
        status: 'Completed',
        victimsFound: 1,
        totalDetections: 3,
        avgConfidence: 78,
        confidenceThreshold: 75,
        model: 'angled',
        tempRange: '36.8°C',
        victims: [
          {
            id: 'V003',
            status: 'Stable',
            bodyTemp: 36.8,
            confidence: 89,
            detectionTime: new Date('2024-01-14T14:45:00')
          }
        ]
      },
      {
        id: 'MSN003',
        date: new Date('2024-01-13T09:00:00'),
        duration: '3h 30m',
        status: 'Aborted',
        victimsFound: 0,
        totalDetections: 12,
        avgConfidence: 65,
        confidenceThreshold: 80,
        model: 'top',
        tempRange: 'N/A',
        victims: []
      }
    ];
  }

  private saveMissions() {
    try {
      localStorage.setItem('mission-history', JSON.stringify(this.missions));
    } catch (error) {
      console.error('Failed to save missions:', error);
    }
  }

  private loadMissions() {
    try {
      const saved = localStorage.getItem('mission-history');
      if (saved) {
        this.missions = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  }
}
