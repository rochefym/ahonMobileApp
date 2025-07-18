import { Component, OnInit } from '@angular/core';
import { DetectionService } from '../../../services/detection.service';
import { SettingsService } from '../../../services/settings.service';
import { PersonDetectionModelResponseService } from 'src/app/services/api/person-detection-model/person-detection-model-response.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  selectedMode: string = 'thermal';
  selectedViewAngle: 'front' | 'angled' | 'top' = 'front';
  confidenceThreshold: number = 50;
  autoSaveEnabled: boolean = true; // Default to true for search and rescue

  modelSelected: any;

  constructor(
    private detectionService: DetectionService,
    private settingsService: SettingsService,
    private personDetectionModelResponseService: PersonDetectionModelResponseService
  ) { }

  async ngOnInit() {
    this.loadSettings();

    // Load Initial Model Settings
    this.modelSelected = await this.personDetectionModelResponseService.getSelectedModel();
    let model_id = this.modelSelected.id;
    let angle: 'front' | 'angled' | 'top';
    if (model_id == 1) {
      angle = 'top';
    } else if (model_id == 2) {
      angle = 'front';
    } else {
      angle = 'angled';
    }

    this.confidenceThreshold = this.modelSelected.confidence;
    this.settingsService.setConfidenceThreshold(this.confidenceThreshold);
    this.selectViewAngle(angle);
  }

  loadInitialModel() {

  }

  selectMode(mode: string) {
    this.selectedMode = mode;
    this.settingsService.setViewMode(mode);
    console.log('View mode changed to:', mode);
  }

  async selectViewAngle(angle: 'front' | 'angled' | 'top') {
    this.selectedViewAngle = angle;
    this.settingsService.setViewAngle(angle);
    this.detectionService.updateModelEndpoint(angle);

    let model_id = 1;
    if (angle == 'top') {
      model_id = 1;
    } else if (angle == 'front') {
      model_id = 2;
    } else {
      model_id = 3;
    }

    const personDetectionModel = {
      id: model_id,
      confidence: this.confidenceThreshold / 100
    }

    this.modelSelected = await this.personDetectionModelResponseService.updatePersonDetectionModel(personDetectionModel);
    console.log('View angle changed to:', angle);
  }

  getModelDescription(angle: 'front' | 'angled' | 'top'): string {
    const descriptions = {
      'front': 'Front/Side detection model loaded',
      'angled': 'Angled view detection model loaded',
      'top': 'Top view detection model loaded'
    };
    return descriptions[angle];
  }

  onConfidenceChange(event: any) {
    this.confidenceThreshold = event.detail.value;
    this.settingsService.setConfidenceThreshold(this.confidenceThreshold);

    // Send confidence threshold to backend in real-time
    this.detectionService.updateConfidenceThreshold(this.confidenceThreshold);

    console.log('Confidence threshold changed to:', this.confidenceThreshold);
  }

  onAutoSaveChange(event: any) {
    this.autoSaveEnabled = event.detail.checked;
    this.settingsService.setAutoSave(this.autoSaveEnabled);
    console.log('Auto-save detections changed to:', this.autoSaveEnabled);
  }

  private loadSettings() {
    this.selectedMode = this.settingsService.getViewMode();
    this.selectedViewAngle = this.settingsService.getViewAngle();
    this.confidenceThreshold = this.settingsService.getConfidenceThreshold();
    this.autoSaveEnabled = this.settingsService.getAutoSave();
  }

}

