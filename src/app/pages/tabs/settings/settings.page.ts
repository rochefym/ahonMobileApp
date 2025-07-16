import { Component, OnInit } from '@angular/core';
import { DetectionService } from '../../../services/detection.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  selectedMode: string = 'thermal';
  selectedViewAngle: 'front' | 'angled' | 'top' = 'front';
  confidenceThreshold: number = 70;
  autoSaveEnabled: boolean = true; // Default to true for search and rescue

  constructor(
    private detectionService: DetectionService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
    this.settingsService.setViewMode(mode);
    console.log('View mode changed to:', mode);
  }

  selectViewAngle(angle: 'front' | 'angled' | 'top') {
    this.selectedViewAngle = angle;
    this.settingsService.setViewAngle(angle);
    this.detectionService.updateModelEndpoint(angle);
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

