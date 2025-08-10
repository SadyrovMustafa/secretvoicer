export interface BarkVoice {
  voice_id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  description?: string;
  preview_url?: string;
}

export interface BarkTTSRequest {
  text: string;
  voice_id?: string;
  language?: string;
  speed?: number; // 0.5 - 2.0
  temperature?: number; // 0.0 - 1.0
  top_k?: number; // 1 - 100
  top_p?: number; // 0.0 - 1.0
  waveform_temp?: number; // 0.0 - 1.0
}

export interface BarkTTSResponse {
  audio: string; // base64 encoded audio
  success: boolean;
  error?: string;
}

export interface BarkSettings {
  speed: number;
  temperature: number;
  top_k: number;
  top_p: number;
  waveform_temp: number;
  // Дополнительные настройки для улучшения качества
  repetition_penalty?: number;
  length_penalty?: number;
  no_speech_threshold?: number;
  compression_ratio_threshold?: number;
  logprob_threshold?: number;
}

// Предустановленные голоса Bark
export const BARK_VOICES: BarkVoice[] = [
  // Русские голоса
  { voice_id: 'v2/ru_speaker_0', name: 'Русский (Мужской)', language: 'ru', gender: 'male' },
  { voice_id: 'v2/ru_speaker_1', name: 'Русский (Женский)', language: 'ru', gender: 'female' },
  { voice_id: 'v2/ru_speaker_2', name: 'Русский (Мужской 2)', language: 'ru', gender: 'male' },
  { voice_id: 'v2/ru_speaker_3', name: 'Русский (Женский 2)', language: 'ru', gender: 'female' },
  
  // Английские голоса
  { voice_id: 'v2/en_speaker_0', name: 'English (Male)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_1', name: 'English (Female)', language: 'en', gender: 'female' },
  { voice_id: 'v2/en_speaker_2', name: 'English (Male 2)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_3', name: 'English (Female 2)', language: 'en', gender: 'female' },
  { voice_id: 'v2/en_speaker_4', name: 'English (Male 3)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_5', name: 'English (Female 3)', language: 'en', gender: 'female' },
  { voice_id: 'v2/en_speaker_6', name: 'English (Male 4)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_7', name: 'English (Female 4)', language: 'en', gender: 'female' },
  { voice_id: 'v2/en_speaker_8', name: 'English (Male 5)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_9', name: 'English (Female 5)', language: 'en', gender: 'female' },
  // Дополнительные английские голоса
  { voice_id: 'v2/en_speaker_10', name: 'English (Male 6)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_11', name: 'English (Female 6)', language: 'en', gender: 'female' },
  { voice_id: 'v2/en_speaker_12', name: 'English (Male 7)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_13', name: 'English (Female 7)', language: 'en', gender: 'female' },
  { voice_id: 'v2/en_speaker_14', name: 'English (Male 8)', language: 'en', gender: 'male' },
  { voice_id: 'v2/en_speaker_15', name: 'English (Female 8)', language: 'en', gender: 'female' },
  
  // Турецкие голоса
  { voice_id: 'v2/tr_speaker_0', name: 'Türkçe (Erkek)', language: 'tr', gender: 'male' },
  { voice_id: 'v2/tr_speaker_1', name: 'Türkçe (Kadın)', language: 'tr', gender: 'female' },
  
  // Казахские голоса
  { voice_id: 'v2/kk_speaker_0', name: 'Қазақша (Ер)', language: 'kk', gender: 'male' },
  { voice_id: 'v2/kk_speaker_1', name: 'Қазақша (Әйел)', language: 'kk', gender: 'female' },
  
  // Дополнительные голоса
  { voice_id: 'v2/zh_speaker_0', name: '中文 (男)', language: 'zh', gender: 'male' },
  { voice_id: 'v2/zh_speaker_1', name: '中文 (女)', language: 'zh', gender: 'female' },
  { voice_id: 'v2/ja_speaker_0', name: '日本語 (男性)', language: 'ja', gender: 'male' },
  { voice_id: 'v2/ja_speaker_1', name: '日本語 (女性)', language: 'ja', gender: 'female' },
  { voice_id: 'v2/ko_speaker_0', name: '한국어 (남성)', language: 'ko', gender: 'male' },
  { voice_id: 'v2/ko_speaker_1', name: '한국어 (여성)', language: 'ko', gender: 'female' },
  { voice_id: 'v2/fr_speaker_0', name: 'Français (Homme)', language: 'fr', gender: 'male' },
  { voice_id: 'v2/fr_speaker_1', name: 'Français (Femme)', language: 'fr', gender: 'female' },
  { voice_id: 'v2/de_speaker_0', name: 'Deutsch (Mann)', language: 'de', gender: 'male' },
  { voice_id: 'v2/de_speaker_1', name: 'Deutsch (Frau)', language: 'de', gender: 'female' },
  { voice_id: 'v2/es_speaker_0', name: 'Español (Hombre)', language: 'es', gender: 'male' },
  { voice_id: 'v2/es_speaker_1', name: 'Español (Mujer)', language: 'es', gender: 'female' },
  { voice_id: 'v2/it_speaker_0', name: 'Italiano (Uomo)', language: 'it', gender: 'male' },
  { voice_id: 'v2/it_speaker_1', name: 'Italiano (Donna)', language: 'it', gender: 'female' },
  { voice_id: 'v2/pt_speaker_0', name: 'Português (Homem)', language: 'pt', gender: 'male' },
  { voice_id: 'v2/pt_speaker_1', name: 'Português (Mulher)', language: 'pt', gender: 'female' },
]; 