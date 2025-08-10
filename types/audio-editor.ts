export interface AudioSegment {
  id: string;
  startTime: number; // в секундах
  endTime: number; // в секундах
  audioUrl: string;
  text?: string;
  volume: number; // 0-1
  speed: number; // 0.5-3.0
  pitch: number; // -12 до 12 полутонов
}

export interface AudioProject {
  id: string;
  name: string;
  segments: AudioSegment[];
  backgroundMusic?: {
    url: string;
    volume: number;
    loop: boolean;
  };
  totalDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioEffect {
  type: 'echo' | 'reverb' | 'fadeIn' | 'fadeOut' | 'normalize' | 'noiseReduction';
  enabled: boolean;
  intensity: number; // 0-1
  parameters?: Record<string, number>;
}

export interface AudioEditorState {
  currentProject: AudioProject | null;
  selectedSegmentId: string | null;
  isPlaying: boolean;
  currentTime: number;
  zoom: number; // масштаб временной шкалы
  showWaveform: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number; // в секундах
}
