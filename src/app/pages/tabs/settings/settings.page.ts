import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { ImageStreamService } from 'src/app/services/api/stream/image-stream.service';
=======
import { DetectionService } from '../../../services/detection.service';
import { SettingsService } from '../../../services/settings.service';
>>>>>>> aj/restoffeatures

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
<<<<<<< HEAD
  imageUrl: string = '';
  isLoading: boolean = false;
  error: string = '';
  currentImageUrl: any = 'https://7pd4fg47-8000.asse.devtunnels.ms/api/image/';

  constructor(private imageService: ImageStreamService) { }

  ngOnInit() {
    this.loadImageBase64();
=======
  selectedMode: string = 'thermal';
  selectedViewAngle: 'front' | 'angled' | 'top' = 'front';
  confidenceThreshold: number = 70;
  autoSaveEnabled: boolean = true; // Default to true for search and rescue

  constructor(
    private detectionService: DetectionService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.loadSettings();
>>>>>>> aj/restoffeatures
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
<<<<<<< HEAD
    // Emit event or call service to handle mode change
    console.log('Selected mode:', mode);
  }// Method 1: Using blob and object URL (recommended)


  loadImage() {
    this.isLoading = true;
    this.error = '';

    this.imageService.getImageBlob().subscribe({
      next: (blob) => {
        // Clean up previous object URL to prevent memory leaks
        if (this.imageUrl) {
          URL.revokeObjectURL(this.imageUrl);
        }

        // Create new object URL
        this.imageUrl = URL.createObjectURL(blob);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading image:', error);
        this.error = 'Failed to load image';
        this.isLoading = false;
      }
    });
  }

  // Method 2: Using base64 string
  loadImageBase64() {
    this.isLoading = true;
    this.error = '';

    this.imageService.getImageBase64().subscribe({
      next: (base64) => {
        this.imageUrl = base64;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading image:', error);
        this.error = 'Failed to load image';
        this.isLoading = false;
      }
    });
  }

  // Method 3: Direct URL (simplest but less control)
  loadImageDirect() {
    this.imageUrl = this.imageService.getImageUrl();
  }

  // Refresh image
  refreshImage() {
    this.loadImageBase64();
  }

  // Clean up object URL when component is destroyed
  ngOnDestroy() {
    if (this.imageUrl && this.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}
=======
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
 
>>>>>>> aj/restoffeatures
