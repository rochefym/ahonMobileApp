import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-selector',
  templateUrl: './input-selector.component.html',
  styleUrls: ['./input-selector.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class InputSelectorComponent {
  @Output() inputTypeChange = new EventEmitter<'image' | 'video' | 'stream'>();
  
  selectedInput: 'image' | 'video' | 'stream' = 'stream';

  onInputChange(event: any) {
    this.selectedInput = event.detail.value;
    this.inputTypeChange.emit(this.selectedInput);
  }

  onFileUpload(event: any, type: 'image' | 'video') {
    const file = event.target.files[0];
    if (file) {
      console.log(`${type} uploaded:`, file.name);
      // Handle file upload logic here
    }
  }

  constructor() { }

  ngOnInit() {}

}
