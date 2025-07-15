import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IonSearchbar, IonIcon } from "@ionic/angular/standalone";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
  count?: number;
}

@Component({
  selector: 'app-victim-filter',
  templateUrl: './victim-filter.component.html',
  styleUrls: ['./victim-filter.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonIcon]
})
export class VictimFilterComponent {
  @Input() allVictimsCount: number = 0;
  @Input() detectionCount: number = 0;
  @Input() recentCount: number = 0;
  @Input() stableCount: number = 0;
  @Input() criticalCount: number = 0;
  @Input() initialFilter: string = 'all';
  @Input() isCollapsedInitially: boolean = false;

  @Output() filterChanged = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() collapseChanged = new EventEmitter<boolean>();

  selectedFilter: string = 'all';
  searchTerm: string = '';
  isCollapsed: boolean = false;

  ngOnInit() {
    this.selectedFilter = this.initialFilter;
    this.isCollapsed = this.isCollapsedInitially;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChanged.emit(this.isCollapsed);
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterChanged.emit(filter);
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.searchChanged.emit(this.searchTerm);
  }
}