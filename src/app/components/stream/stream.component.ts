import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class StreamComponent  implements OnInit {
  @Input() streamType: 'image' | 'video' | 'live' = 'live';
  @Input() detectionEnabled = true;
  
  selectedView: 'front' | 'side' | 'angled' | 'top' = 'front';
  
  // Mock detection data for demo
  mockDetections = [
    { id: 1, x: 150, y: 200, width: 80, height: 120, confidence: 0.85, pose: 'standing' },
    { id: 2, x: 300, y: 180, width: 90, height: 100, confidence: 0.92, pose: 'lying' }
  ];

  
  constructor() { }

  ngOnInit() {}


  onViewChange(event: any) {
    this.selectedView = event.detail.value;
    console.log('View changed to:', this.selectedView);
  }

}
