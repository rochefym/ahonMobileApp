export interface Victim {
  id: string;
  status: 'Stable' | 'Critical' | 'Unknown';
  temperature: number;
  confidence: number;
}

export interface Mission {
  id: string; // e.g., MSN001
  status: 'Completed' | 'Aborted' | 'In Progress';
  date: string;
  duration: string;
  detectionModel: 'front' | 'angled' | 'top';
  confidenceThreshold: number;
  totalDetections: number;
  averageConfidence?: number;
  temperatureRange?: string;
  victims: Victim[];
}