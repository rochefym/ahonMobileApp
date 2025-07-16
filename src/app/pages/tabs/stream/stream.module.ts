import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StreamPageRoutingModule } from './stream-routing.module';
import { StreamPage } from './stream.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { DetectionStreamComponent } from "src/app/components/detection-stream/detection-stream.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreamPageRoutingModule,
<<<<<<< HEAD
    HeaderComponent,
    DetectionStreamComponent
=======
    MissionTimerComponent,
    HeaderComponent
>>>>>>> aj/restoffeatures
  ],
  declarations: [StreamPage]

})
export class StreamPageModule { }
