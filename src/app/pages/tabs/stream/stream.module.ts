import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StreamPageRoutingModule } from './stream-routing.module';
import { StreamPage } from './stream.page';
import { HeaderComponent } from 'src/app/components/header/header.component';

// Components
import { MissionTimerComponent } from "src/app/components/mission-timer/mission-timer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreamPageRoutingModule,
    MissionTimerComponent,
    HeaderComponent
  ],
  declarations: [StreamPage]

})
export class StreamPageModule { }
