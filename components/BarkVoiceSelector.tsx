import { useState } from 'react';
import { BarkVoice, BARK_VOICES } from '../types/bark';

interface BarkVoiceSelectorProps {
  selectedVoiceId: string | null;
  onVoiceChange: (voiceId: string) => void;
  language?: string;
}

export const BarkVoiceSelector: React.FC<BarkVoiceSelectorProps> = ({
  selectedVoiceId,
  onVoiceChange,
  language = 'ru',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllVoices, setShowAllVoices] = useState(false);

  const selectedVoice = BARK_VOICES.find(voice => voice.voice_id === selectedVoiceId);

  const filteredVoices = BARK_VOICES.filter(voice => {
    // Если включен режим "показать все", показываем все голоса
    if (showAllVoices) {
      return true;
    }
    // Фильтруем по языку, если указан
    if (language) {
      const interfaceLang = language.split('-')[0];
      // Показываем голоса для выбранного языка + английские голоса всегда
      return voice.language === interfaceLang || voice.language === 'en';
    }
    return true;
  });

  const getGenderIcon = (gender: 'male' | 'female') => {
    return gender === 'male' ? '👨' : '👩';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-dark-card border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">🐕</span>
          <span className="text-dark-text">
            {selectedVoice ? selectedVoice.name : 'Выберите голос Bark'}
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

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-dark-card border border-gray-600 rounded-lg shadow-lg z-50">
          {/* Кнопка показать все голоса */}
          <div className="px-4 py-2 border-b border-gray-600">
            <button
              onClick={() => setShowAllVoices(!showAllVoices)}
              className="text-sm text-accent-yellow hover:text-yellow-300 transition-colors"
            >
              {showAllVoices ? 'Показать только текущий язык' : 'Показать все голоса'}
            </button>
          </div>
          
          {filteredVoices.length === 0 ? (
            <div className="px-4 py-3 text-dark-text-secondary text-sm">
              Голоса не найдены для выбранного языка
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
                  <span className="text-lg">{getGenderIcon(voice.gender)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-dark-text font-medium truncate">
                    {voice.name}
                  </div>
                  <div className="text-dark-text-secondary text-sm truncate">
                    {voice.language.toUpperCase()} • {voice.gender === 'male' ? 'Мужской' : 'Женский'}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}; 