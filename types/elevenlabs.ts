export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  samples: any[];
  category: string;
  fine_tuning: {
    language: string;
    is_allowed_to_fine_tune: boolean;
    fine_tuning_requested_at: string | null;
    finetuning_request_status: string;
    verification_attempts: any[];
    manual_verification_requested_at: string | null;
    language_labels: any;
    verification_attempts_count: number;
    verification_failures: string[];
    verification_attempts_count_remaining: number;
    slice_ids: string[];
    manual_verification: {
      extra_text: string;
      request_time_unix: number;
      files: any[];
    };
  };
  description: string | null;
  preview_url: string;
  available_for_tiers: string[];
  settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  sharing: {
    status: string;
    history_item_sample_id: string | null;
    original_voice_id: string | null;
    public_owner_id: string | null;
    liked_by_count: number;
    cloned_by_count: number;
    name: string | null;
    description: string | null;
    labels: any;
    enabled_in_library: boolean;
    instagram_username: string | null;
    twitter_username: string | null;
    youtube_username: string | null;
    tiktok_username: string | null;
  };
  labels: {
    [key: string]: string;
  };
}

export interface ElevenLabsTTSRequest {
  text: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  voice_id: string;
}

export interface ElevenLabsTTSResponse {
  audio: string; // base64 encoded audio
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface PlaybackSettings {
  speed: number; // 0.5 - 2.0
  pitch: number; // -20 - 20
  volume: number; // 0 - 1
  pauseBetweenSentences: number; // milliseconds
  effects: {
    echo: boolean;
    reverb: boolean;
    echoLevel: number; // 0 - 1
    reverbLevel: number; // 0 - 1
  };
} 