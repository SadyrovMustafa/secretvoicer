import { useState, useEffect } from 'react';
import { ElevenLabsVoice } from '../types/elevenlabs';

interface VoiceSelectorProps {
  selectedVoiceId: string | null;
  onVoiceChange: (voiceId: string) => void;
  language?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onVoiceChange,
  language = 'ru-RU',
}) => {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/voices');
      const data = await response.json();

      if (data.success && data.voices) {
        setVoices(data.voices);
      } else {
        setError(data.error || 'Не удалось загрузить голоса');
      }
    } catch (err) {
      setError('Ошибка загрузки голосов');
    } finally {
      setLoading(false);
    }
  };

  const selectedVoice = voices.find(voice => voice.voice_id === selectedVoiceId);

  const filteredVoices = voices.filter(voice => {
    // Фильтруем по языку, если указан
    if (language) {
      const voiceLanguage = voice.labels?.language || voice.labels?.accent || '';
      return voiceLanguage.toLowerCase().includes(language.split('-')[0].toLowerCase());
    }
    return true;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center justify-between w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg hover:border-gray-500 transition-colors disabled:opacity-50"
      >
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-lg">🎤</span>
          )}
          <span className="text-dark-text">
            {selectedVoice ? selectedVoice.name : 'Выберите голос'}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-dark-text transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-dark-card border border-gray-600 rounded-lg shadow-lg z-50">
          {filteredVoices.length === 0 ? (
            <div className="px-4 py-3 text-dark-text-secondary text-sm">
              {loading ? 'Загрузка голосов...' : 'Голоса не найдены'}
            </div>
          ) : (
            filteredVoices.map((voice) => (
              <button
                key={voice.voice_id}
                onClick={() => {
                  onVoiceChange(voice.voice_id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                  selectedVoiceId === voice.voice_id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <span className="text-lg">🎤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-dark-text font-medium truncate">
                    {voice.name}
                  </div>
                  <div className="text-dark-text-secondary text-sm truncate">
                    {voice.labels?.accent || voice.labels?.language || 'Неизвестный акцент'}
                  </div>
                </div>
                {voice.preview_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const audio = new Audio(voice.preview_url);
                      audio.play();
                    }}
                    className="flex-shrink-0 p-1 text-dark-text-secondary hover:text-dark-text"
                  >
                    ▶️
                  </button>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}; 