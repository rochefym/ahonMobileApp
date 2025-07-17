import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { MissionService, Mission } from '../../../services/api/mission/mission.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage implements OnInit {
  public missions$: Observable<Mission[]>;
  expandedMissionId: number | null = null;

  constructor(
    private missionService: MissionService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.missions$ = this.missionService.missionHistory$;
  }

  ngOnInit() {
    // Data is loaded via the observable in the template
  }

  // Use ionViewWillEnter to ensure the data is fresh every time the user visits the page.
  ionViewWillEnter() {
    this.missionService.loadMissionHistory().subscribe();
  }

  toggleMissionExpansion(missionId: number) {
    this.expandedMissionId = this.expandedMissionId === missionId ? null : missionId;
  }

  getStatusIcon(mission: Mission): string {
    if (mission.status === 'Completed') {
      return 'checkmark-circle-outline';
    } else if (mission.status === 'Aborted') {
      return 'close-circle-outline';
    }
    return 'hourglass-outline'; // For 'In Progress'
  }

  async deleteMission(missionId: number, event: Event) {
    event.stopPropagation(); // Prevent the card from expanding

    const alert = await this.alertController.create({
      header: 'Delete Mission',
      message: 'Are you sure you want to delete this mission? This action is permanent.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.missionService.deleteMission(missionId).subscribe({
              next: () => this.showDeletedToast('Mission deleted successfully.'),
              error: (err) => {
                console.error('Error deleting mission', err);
                this.showDeletedToast('Failed to delete mission.', 'danger');
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  // Placeholder for the export functionality
  async exportMission(mission: Mission, event: Event) {
    event.stopPropagation();
    console.log('Exporting mission:', mission.mission_id_str);
    const toast = await this.toastController.create({
      message: `Exporting report for ${mission.mission_id_str}...`,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
    // TODO: Implement actual report generation and export logic here.
  }

  async showDeletedToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }

  // This function is used by *ngFor to improve performance by tracking items by their unique ID.
  trackMissionById(index: number, mission: Mission): number {
    return mission.id;
  }
}