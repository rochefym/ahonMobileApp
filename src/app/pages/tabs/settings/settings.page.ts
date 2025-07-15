import { Component, OnInit } from '@angular/core';
import { ImageStreamService } from 'src/app/services/api/stream/image-stream.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  imageUrl: string = '';
  isLoading: boolean = false;
  error: string = '';
  currentImageUrl: any = 'https://7pd4fg47-8000.asse.devtunnels.ms/api/image/';

  constructor(private imageService: ImageStreamService) { }

  ngOnInit() {
    this.loadImageBase64();
  }

  selectedMode: string = 'visible';

  selectMode(mode: string) {
    this.selectedMode = mode;
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