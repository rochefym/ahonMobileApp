import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonProgressBar, IonCardContent, IonCard } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-victim-info',
  templateUrl: './victim-info.component.html',
  styleUrls: ['./victim-info.component.scss'],
  imports: [IonCard, IonCardContent, IonProgressBar, IonIcon, DatePipe, DecimalPipe],
})
export class VictimInfoComponent implements OnInit {
  @Input() detection: any;
  @Input() victim: any;

  constructor() { }

  ngOnInit() { }

}
