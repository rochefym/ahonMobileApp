import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageStreamService {
  baseUrl = 'http://192.168.1.4:8000/api';
  httpHeaders = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  getImage(): Observable<any> {
    return this.http.get(this.baseUrl + '/image/',
      { headers: this.httpHeaders });
  }


  // Method 1: Get image as blob and create object URL
  getImageBlob(): Observable<Blob> {
    return this.http.get(this.baseUrl + '/image/', {
      responseType: 'blob'
    });
  }

  // Method 2: Get image URL directly (for img src)
  getImageUrl(): string {
    return this.baseUrl + '/image/';
  }

  // Method 3: Get image as base64 string
  getImageBase64(): Observable<string> {
    return new Observable(observer => {
      this.getImageBlob().subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          observer.next(reader.result as string);
          observer.complete();
        };
        reader.readAsDataURL(blob);
      });
    });
  }
}
