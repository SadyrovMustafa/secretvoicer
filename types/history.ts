export interface HistoryItem {
  id: string;
  text: string;
  language: string;
  audioUrl?: string;
  voiceName?: string;
  voiceId?: string;
  useBark?: boolean;
  useElevenLabs?: boolean;
  timestamp: number;
  voiceSettings?: any;
  playbackSettings?: any;
  barkSettings?: any;
  settings?: {
    bark?: any;
    elevenlabs?: any;
    playback?: any;
  };
}

export interface HistoryFilters {
  search: string;
  voiceType?: 'bark' | 'elevenlabs' | 'browser';
  language?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
