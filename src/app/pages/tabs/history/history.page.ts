import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { DetectionService } from 'src/app/services/api/detection/detection.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage implements OnInit {
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
  }
}
