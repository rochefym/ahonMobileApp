import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
  viewMode: string;
  viewAngle: 'front' | 'angled' | 'top';
  confidenceThreshold: number;
  autoSave: boolean;
  realTimeUpdates: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private defaultSettings: AppSettings = {
    viewMode: 'thermal',
    viewAngle: 'front',
    confidenceThreshold: 70,
    autoSave: false,
    realTimeUpdates: true
  };

  private settingsSubject = new BehaviorSubject<AppSettings>(this.defaultSettings);
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadSettings();
  }

  // View Mode
  setViewMode(mode: string) {
    const currentSettings = this.settingsSubject.value;
    this.updateSettings({ ...currentSettings, viewMode: mode });
  }

  getViewMode(): string {
    return this.settingsSubject.value.viewMode;
  }

  // View Angle
  setViewAngle(angle: 'front' | 'angled' | 'top') {
    const currentSettings = this.settingsSubject.value;
    this.updateSettings({ ...currentSettings, viewAngle: angle });
  }

  getViewAngle(): 'front' | 'angled' | 'top' {
    return this.settingsSubject.value.viewAngle;
  }

  // Confidence Threshold
  setConfidenceThreshold(threshold: number) {
    const currentSettings = this.settingsSubject.value;
    this.updateSettings({ ...currentSettings, confidenceThreshold: threshold });
  }

  getConfidenceThreshold(): number {
    return this.settingsSubject.value.confidenceThreshold;
  }

  // Auto Save
  setAutoSave(enabled: boolean) {
    const currentSettings = this.settingsSubject.value;
    this.updateSettings({ ...currentSettings, autoSave: enabled });
  }

  getAutoSave(): boolean {
    return this.settingsSubject.value.autoSave;
  }

  // Real Time Updates
  setRealTimeUpdates(enabled: boolean) {
    const currentSettings = this.settingsSubject.value;
    this.updateSettings({ ...currentSettings, realTimeUpdates: enabled });
  }

  getRealTimeUpdates(): boolean {
    return this.settingsSubject.value.realTimeUpdates;
  }

  // Get all settings
  getAllSettings(): AppSettings {
    return this.settingsSubject.value;
  }

  // Reset to defaults
  resetToDefaults() {
    this.updateSettings(this.defaultSettings);
  }

  private updateSettings(settings: AppSettings) {
    this.settingsSubject.next(settings);
    this.saveSettings(settings);
  }

  private saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private loadSettings() {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        this.settingsSubject.next({ ...this.defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
}
