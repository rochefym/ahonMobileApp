import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  constructor(private platform: Platform) { }

  ngOnInit() {
    // Apply dark theme immediately
    document.body.classList.add('ion-palette-dark');

    // Configure status bar for dark theme (mobile only)
    if (this.platform.is('capacitor')) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#0f1419' });
    }
  }
}