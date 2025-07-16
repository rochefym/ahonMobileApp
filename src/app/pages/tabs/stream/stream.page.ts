import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { DetectionService } from '../../../services/detection.service';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';
import { SettingsService } from '../../../services/settings.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
  standalone: false
})
export class StreamPage implements OnInit, OnDestroy {
  @ViewChild('videoFileInput') videoFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('imageFileInput') imageFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoCanvas') videoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('imageCanvas') imageCanvas!: ElementRef<HTMLCanvasElement>;

  currentInputType: 'image' | 'video' | 'stream' = 'stream';
  isDetectionActive = false;
  isStreamActive = false;
  streamType: 'regular' | 'yolo' = 'regular';

  selectedVideoFile: string | null = null;
  selectedImageFile: string | null = null;
  detectionResults: any[] = [];
  detectionCount = 0;
  lastDetectionTime: Date | null = null;

  private detectionSubscription: Subscription;
  private detectionInterval: any;

  baseUrl: string = 'http://192.168.1.4:8000';
  url: string = 'http://192.168.1.4:8000/api/detection-stream/';

  constructor(
    private iab: InAppBrowser,
    private sanitizer: DomSanitizer,
    private detectionService: DetectionService,
    private settingsService: SettingsService,
    private missionStateService: MissionStateService
  ) {
    this.detectionSubscription = this.detectionService.detectionCount$.subscribe(
      count => this.detectionCount = count
    );

    // Subscribe to mission status changes
    this.isMissionOngoingSubscription = this.missionStateService.isMissionOngoing$.subscribe(isOngoing => {
      this.isMissionOngoing = isOngoing;
    });

    // Subscribe to mission changes
    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });
  }

  private isMissionOngoingSubscription!: Subscription;
  isMissionOngoing: boolean = false;

  private missionSub!: Subscription;
  currentMission: any;



  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.detectionSubscription) {
      this.detectionSubscription.unsubscribe();
    }
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }

    this.isMissionOngoingSubscription.unsubscribe();
    this.missionSub.unsubscribe();
  }

  onInputTypeChange(event: any) {
    this.currentInputType = event.detail.value;
    this.stopDetection(); // Stop any active detection when switching
    console.log('Input type changed to:', this.currentInputType);
  }

  // Video handling
  triggerVideoFileInput() {
    this.videoFileInput.nativeElement.click();
  }

  onVideoFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = URL.createObjectURL(file);
    }
  }

  onVideoLoaded() {
    console.log('Video loaded successfully');
  }

  onVideoTimeUpdate() {
    if (this.isDetectionActive && this.videoPlayer) {
      this.performVideoDetection();
    }
  }

  // Image handling
  triggerImageFileInput() {
    this.imageFileInput.nativeElement.click();
  }

  onImageFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = URL.createObjectURL(file);
    }
  }

  onImageLoaded() {
    console.log('Image loaded successfully');
    if (this.isDetectionActive) {
      this.performImageDetection();
    }
  }

  // Stream handling
  toggleStream() {
    this.isStreamActive = !this.isStreamActive;
    if (this.isStreamActive) {
      console.log('Stream started');
    } else {
      console.log('Stream stopped');
      this.stopDetection();
    }
  }

  toggleStreamType() {
    this.streamType = this.streamType === 'regular' ? 'yolo' : 'regular';
    console.log('Stream type switched to:', this.streamType);
  }

  getCurrentStreamUrl(): SafeResourceUrl {
    // Use the detection service to get the correct endpoint based on selected model
    const streamUrl = this.detectionService.getStreamEndpoint();
    return this.sanitizer.bypassSecurityTrustResourceUrl(streamUrl);
  }

  // Detection methods
  startDetection() {
    this.isDetectionActive = true;
    this.lastDetectionTime = new Date();

    switch (this.currentInputType) {
      case 'video':
        this.startVideoDetection();
        break;
      case 'image':
        this.performImageDetection();
        break;
      case 'stream':
        this.startStreamDetection();
        break;
    }

    console.log('Detection started for:', this.currentInputType);
  }

  stopDetection() {
    this.isDetectionActive = false;
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }
    console.log('Detection stopped');
  }

  resetDetection() {
    this.detectionCount = 0;
    this.detectionResults = [];
    this.lastDetectionTime = null;
    this.detectionService.updateDetectionCount(0);
    console.log('Detection reset');
  }

  private startVideoDetection() {
    // Simulate video detection - replace with actual ML detection
    this.detectionInterval = setInterval(() => {
      this.performVideoDetection();
    }, 1000);
  }

  private performVideoDetection() {
    // Simulate detection results - replace with actual ML detection
    const mockDetectionCount = Math.floor(Math.random() * 5);
    this.updateDetectionCount(mockDetectionCount);
    this.drawVideoDetections();
  }

  private async performImageDetection() {
    try {
      if (!this.selectedImageFile) return;

      // Convert image to FormData for API call
      const formData = new FormData();
      // In real implementation, you'd convert the image file to blob
      // formData.append('image', imageBlob);

      // For now, simulate the API call
      const result = await this.detectionService.detectFromImage(formData);
      this.updateDetectionCount(result.detectionCount || 0);
      this.drawImageDetections();
    } catch (error) {
      console.error('Image detection failed:', error);
      // Fallback to mock detection
      const mockDetectionCount = Math.floor(Math.random() * 3) + 1;
      this.updateDetectionCount(mockDetectionCount);
      this.drawImageDetections();
    }
  }

  private startStreamDetection() {
    // Simulate stream detection - replace with actual ML detection
    this.detectionInterval = setInterval(() => {
      const mockDetectionCount = Math.floor(Math.random() * 8);
      this.updateDetectionCount(mockDetectionCount);
    }, 2000);
  }

  private updateDetectionCount(count: number) {
    this.detectionCount = count;
    this.lastDetectionTime = new Date();
    this.detectionService.updateDetectionCount(count);
  }

  private drawVideoDetections() {
    if (!this.videoCanvas || !this.videoPlayer) return;

    const canvas = this.videoCanvas.nativeElement;
    const video = this.videoPlayer.nativeElement;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mock bounding boxes
      for (let i = 0; i < this.detectionCount; i++) {
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 100);

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 80, 100);

        ctx.fillStyle = '#00ff00';
        ctx.font = '14px Arial';
        ctx.fillText(`Person ${i + 1}`, x, y - 5);
      }
    }
  }

  private drawImageDetections() {
    if (!this.imageCanvas || !this.imageElement) return;

    const canvas = this.imageCanvas.nativeElement;
    const img = this.imageElement.nativeElement;
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mock bounding boxes
      for (let i = 0; i < this.detectionCount; i++) {
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 100);

        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, 80, 100);

        ctx.fillStyle = '#ff0000';
        ctx.font = '16px Arial';
        ctx.fillText(`Person ${i + 1}`, x, y - 5);
      }
    }
  }

  // Legacy methods (keeping for your peer's work)
  openBrowser() {
    if (!this.url) return;

    const options: InAppBrowserOptions = {
      location: 'yes',           // Show URL bar
      hidden: 'no',              // Show immediately
      clearcache: 'yes',         // Clear cache
      clearsessioncache: 'yes',  // Clear session cache
      zoom: 'yes',               // Allow zoom
      hardwareback: 'yes',       // Use hardware back button
      mediaPlaybackRequiresUserAction: 'no',
      shouldPauseOnSuspend: 'no',
      closebuttoncaption: 'Close',
      disallowoverscroll: 'no',
      toolbar: 'yes',            // Show toolbar
      enableViewportScale: 'yes',
      allowInlineMediaPlayback: 'no',
      presentationstyle: 'pagesheet', // iOS: pagesheet, formsheet, fullscreen
      fullscreen: 'no',          // Don't go fullscreen
      toolbarposition: 'top',    // Toolbar at top
      navigationbuttoncolor: '#ffffff',
      toolbarcolor: '#1976d2',   // Custom toolbar color
      closebuttoncolor: '#ffffff',

      // Custom buttons
      lefttoright: 'yes',        // Button order
      hidenavigationbuttons: 'no',
      hideurlbar: 'no'
    };

    const browser = this.iab.create(this.url, '_blank', options);

    // Method 1: Try on loadstop with better error handling
    browser.on('loadstop').subscribe(() => {
      console.log('Load stop event fired');
      // this.count = this.count + 1;
      this.injectCustomButtons(browser);
    });

    // Method 2: Fallback - try after a delay from loadstart
    browser.on('loadstart').subscribe(() => {
      console.log('Load start event fired');

      setTimeout(() => {
        console.log('Attempting delayed button injection...');
        this.injectCustomButtons(browser);
      }, 3000);
    });

    // Listen for browser events
    browser.on('loadstart').subscribe(event => {
      console.log('Browser started loading:', event.url);
    });

    browser.on('loadstop').subscribe(event => {
      console.log('Browser finished loading:', event.url);
    });

    browser.on('loaderror').subscribe(event => {
      console.error('Browser loading error:', event);
    });

    browser.on('exit').subscribe(() => {
      console.log('Browser closed');
    });
  }

  private injectCustomButtons(browser: any) {
    // First inject CSS
    browser.insertCSS({
      code: `
        .custom-button-container {
          position: fixed !important;
          top: 70px !important;
          right: 10px !important;
          z-index: 99999 !important;
          display: flex !important;
          flex-direction: row !important;
          gap: 8px !important;
          pointer-events: auto !important;
        }
        
        .custom-button {
          background-color: #007bff !important;
          color: white !important;
          padding: 12px 16px !important;
          border: none !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-size: 14px !important;
          font-weight: bold !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
          min-width: 120px !important;
          text-align: center !important;
        }
        
        .custom-button:hover {
          background-color: #0056b3 !important;
        }
        
        .custom-button:active {
          transform: scale(0.95) !important;
        }
      `
    }).then(() => {
      console.log('CSS injected successfully');

      // Then inject the JavaScript
      browser.executeScript({
        code: `
          (function() {
            console.log('Starting button injection script...');
            
            // Function to create buttons
            function createButtons() {
              try {
                console.log('Creating buttons...');
                
                // Remove existing buttons first
                var existingContainer = document.getElementById('custom-button-container');
                if (existingContainer) {
                  existingContainer.remove();
                  console.log('Removed existing buttons');
                }
                
                // Create button container
                var buttonContainer = document.createElement('div');
                buttonContainer.id = 'custom-button-container';
                buttonContainer.className = 'custom-button-container';
                
                // Create Stream button
                var streamBtn = document.createElement('button');
                streamBtn.innerHTML = '▶️ Stream';
                streamBtn.className = 'custom-button';
                streamBtn.style.backgroundColor = '#007bff';
                streamBtn.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Stream button clicked');
                  window.location.href = 'http://192.168.1.4:8000/api/detection-stream';
                  window.location.reload();
                });
                
                // Create Yolo button
                var yoloBtn = document.createElement('button');
                yoloBtn.innerHTML = '👤 Yolov8n';
                yoloBtn.className = 'custom-button';
                yoloBtn.style.backgroundColor = '#28a745';
                yoloBtn.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Yolo button clicked');
                  window.location.href = 'http://192.168.1.4:8000/api/detection-stream';
                  window.location.reload();
                });


                // Create Capture Detection button
                var captureBtn = document.createElement('button');
                captureBtn.innerHTML = 'Capture';
                captureBtn.className = 'custom-button';
                captureBtn.style.backgroundColor = '#28a745';
                captureBtn.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = 'http://192.168.1.4:8000/api/detection-stream';
                  window.location.reload();
                });
                
                // Add buttons to container
                buttonContainer.appendChild(streamBtn);
                buttonContainer.appendChild(yoloBtn);
                buttonContainer.appendChild(captureBtn);
                
                // Add container to body
                document.body.appendChild(buttonContainer);
                
                console.log('Buttons created and added to DOM');
                return true;
              } catch (error) {
                console.error('Error creating buttons:', error);
                return false;
              }
            }
            
            // Try to create buttons immediately
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', createButtons);
            } else {
              createButtons();
            }
            
            // Also try after a small delay as fallback
            setTimeout(function() {
              console.log('Attempting delayed button creation...');
              createButtons();
            }, 1000);
            
            // And another attempt after longer delay
            // setTimeout(function() {
            //   console.log('Attempting final button creation...');
            //   createButtons();
            // }, 3000);
            
          })();
        `
      }).then(() => {
        console.log('JavaScript injected successfully');
      }).catch((err: any) => {
        console.error('JavaScript injection failed:', err);
      });

    }).catch((err: any) => {
      console.error('CSS injection failed:', err);
    });
  }

  openLiveStream() {
    this.url = 'http://192.168.1.4:8000/api/detection-stream';
    this.openBrowser();
  }

}
