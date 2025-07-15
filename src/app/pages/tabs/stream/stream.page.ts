import { Component, OnDestroy, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { DetectionService } from 'src/app/services/api/detection/detection.service';

import { Subscription } from 'rxjs';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
  standalone: false
})


export class StreamPage implements OnInit, OnDestroy {
  baseUrl: string = 'http://192.168.1.4:8000';
  url: string = 'http://192.168.1.4:8000/api/detection-stream/';

  count: number = 0;

  private isMissionOngoingSubscription!: Subscription;
  isMissionOngoing: boolean = false;

  private missionSub!: Subscription;
  currentMission: any;

  constructor(
    private iab: InAppBrowser,
    private detectionService: DetectionService,
    private missionStateService: MissionStateService
  ) {
    // Subscribe to mission status changes
    this.isMissionOngoingSubscription = this.missionStateService.isMissionOngoing$.subscribe(isOngoing => {
      this.isMissionOngoing = isOngoing;
    });

    // Subscribe to mission changes
    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.isMissionOngoingSubscription.unsubscribe();
    this.missionSub.unsubscribe();
  }

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
      this.count = this.count + 1;
      this.captureDetection();
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


  captureDetection() {
    const detection = {
      mission_id: this.currentMission.id, // Replace with actual mission ID
      person_detection_model_id: 2, // Replace with actual model ID
      latitude: 0, // Replace with actual latitude
      longitude: 0, // Replace with actual longitude
      is_live: 'False' // Set to true for live detection
    };

    this.detectionService.captureDetection(detection).subscribe(
      response => {
        console.log('Detection captured successfully:', response);
      },
      error => {
        console.error('Error capturing detection:', error);
      }
    );
  }

}
