<<<<<<< HEAD
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { DetectionService } from 'src/app/services/api/detection/detection.service';
=======
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { DetectionService } from '../../../services/detection.service';
import { HistoryService } from '../../../services/history.service';

export interface Mission {
  id: string;
  date: Date;
  duration: string;
  status: 'Completed' | 'Aborted' | 'Ongoing';
  victimsFound: number;
  totalDetections: number;
  avgConfidence: number;
  confidenceThreshold: number;
  model: 'front' | 'angled' | 'top';
  tempRange: string;
  victims?: Victim[];
}

export interface Victim {
  id: string;
  status: 'Stable' | 'Critical' | 'Deceased';
  bodyTemp: number;
  confidence: number;
  coordinates?: string;
  detectionTime: Date;
}
>>>>>>> aj/restoffeatures

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage implements OnInit {
<<<<<<< HEAD
  detectionRes: any;
  detectionResToJSONString: any;
  detection: any;

  imageUrl: SafeUrl | null = null;
  imgUrl: any = '';


  constructor(
    private detectionService: DetectionService,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    await this.loadDetections('3');
  }

  loadDetections(detectionId: string) {
    this.detectionService.getDetectionById(detectionId).subscribe(
      data => {
        this.detection = data;
      },
      error => {
        console.error('Error loading detections:', error);
      }
    );
=======
  missions: Mission[] = [];
  filteredMissions: Mission[] = [];
  expandedMission: string | null = null;
  showFilters: boolean = false;
  
  // Filter options
  selectedDateRange: string = 'all';
  selectedStatus: string = 'all';
  
  // Statistics
  totalMissions: number = 0;
  totalVictims: number = 0;
  successRate: number = 0;
  avgTemp: number = 0;

  constructor(
    private historyService: HistoryService,
    private detectionService: DetectionService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadMissions();
    this.calculateStatistics();
  }

  loadMissions() {
    // Load from service (will be connected to backend later)
    this.missions = this.historyService.getMissions();
    this.filteredMissions = [...this.missions];
  }

  calculateStatistics() {
    this.totalMissions = this.missions.length;
    this.totalVictims = this.missions.reduce((sum: number, mission: Mission) => sum + mission.victimsFound, 0);
    
    const completedMissions = this.missions.filter((m: Mission) => m.status === 'Completed').length;
    this.successRate = this.totalMissions > 0 ? Math.round((completedMissions / this.totalMissions) * 100) : 0;
    
    // Calculate average temperature from all victims - replace flatMap with reduce
    const allVictims: Victim[] = this.missions.reduce((acc: Victim[], mission: Mission) => {
      return acc.concat(mission.victims || []);
    }, []);
    
    this.avgTemp = allVictims.length > 0 ? 
      Math.round(allVictims.reduce((sum: number, v: Victim) => sum + v.bodyTemp, 0) / allVictims.length) : 0;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onDateRangeChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.missions];
    
    // Date range filter
    if (this.selectedDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (this.selectedDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter((mission: Mission) => mission.date >= filterDate);
    }
    
    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter((mission: Mission) => 
        mission.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }
    
    this.filteredMissions = filtered;
  }

  clearFilters() {
    this.selectedDateRange = 'all';
    this.selectedStatus = 'all';
    this.filteredMissions = [...this.missions];
    this.showFilters = false;
  }

  toggleMissionExpansion(missionId: string) {
    this.expandedMission = this.expandedMission === missionId ? null : missionId;
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'checkmark-circle-outline';
      case 'aborted': return 'close-circle-outline';
      case 'ongoing': return 'time-outline';
      default: return 'help-circle-outline';
    }
  }

  async viewVictimDetails(victim: Victim, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: `Victim #${victim.id}`,
      message: `
        <strong>Status:</strong> ${victim.status}<br>
        <strong>Body Temperature:</strong> ${victim.bodyTemp}°C<br>
        <strong>Detection Confidence:</strong> ${victim.confidence}%<br>
        <strong>Detection Time:</strong> ${victim.detectionTime.toLocaleString()}<br>
        ${victim.coordinates ? `<strong>Coordinates:</strong> ${victim.coordinates}` : ''}
      `,
      buttons: ['Close']
    });
    
    await alert.present();
  }

  async exportMission(mission: Mission, event: Event) {
    event.stopPropagation();
    
    // In real implementation, this would generate and download a report
    const toast = await this.toastController.create({
      message: `Mission ${mission.id} report exported successfully`,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    
    await toast.present();
    
    // TODO: Implement actual export functionality
    console.log('Exporting mission:', mission);
  }

  async deleteMission(missionId: string, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: 'Delete Mission',
      message: 'Are you sure you want to delete this mission? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.historyService.deleteMission(missionId);
            this.loadMissions();
            this.calculateStatistics();
            this.showDeletedToast();
          }
        }
      ]
    });
    
    await alert.present();
  }

  async showDeletedToast() {
    const toast = await this.toastController.create({
      message: 'Mission deleted successfully',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    
    await toast.present();
  }

  trackMissionById(index: number, mission: Mission): string {
    return mission.id;
>>>>>>> aj/restoffeatures
  }
}
