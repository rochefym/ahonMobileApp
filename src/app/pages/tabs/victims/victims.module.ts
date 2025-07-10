import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VictimsPageRoutingModule } from './victims-routing.module';

import { VictimsPage } from './victims.page';
import { VictimInfoComponent } from 'src/app/components/victim-info/victim-info.component';
import { HeaderComponent } from 'src/app/components/header/header.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VictimsPageRoutingModule,
    VictimInfoComponent,
    HeaderComponent
  ],
  declarations: [VictimsPage]
})
export class VictimsPageModule { }
