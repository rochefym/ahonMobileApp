import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  selectedMode: string = 'visible';

  selectMode(mode: string) {
    this.selectedMode = mode;
    // Emit event or call service to handle mode change
    console.log('Selected mode:', mode);
  }

}
