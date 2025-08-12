import { useState } from 'react';
import { HistoryItem } from '../types/history';

interface HistoryPanelProps {
  history: HistoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  onPlay: (item: HistoryItem) => void;
  onLoad: (item: HistoryItem) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onRemove,
  onClear,
  onExport,
  onPlay,
  onLoad,
  filters,
  onFiltersChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVoiceTypeLabel = (item: HistoryItem) => {
    if (item.useBark) return 'Bark';
    if (item.useElevenLabs) return 'ElevenLabs';
    return 'Браузер';
  };

  const getLanguageLabel = (language: string) => {
    const langMap: Record<string, string> = {
      'ru-RU': 'Русский',
      'en-US': 'English',
      'tr-TR': 'Türkçe',
      'kk-KZ': 'Қазақша',
    };
    return langMap[language] || language;
  };

  return (
    <div className="bg-dark-card border border-gray-600 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold text-dark-text">
          История озвучки ({history.length})
        </h3>
        <svg
          className={`w-5 h-5 text-dark-text transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Фильтры */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Поиск по тексту..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow"
            />
            <div className="flex space-x-2">
              <select
                value={filters.voiceType || ''}
                onChange={(e) => onFiltersChange({ ...filters, voiceType: e.target.value || undefined })}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
              >
                <option value="">Все голоса</option>
                <option value="bark">Bark</option>
                <option value="elevenlabs">ElevenLabs</option>
                <option value="browser">Браузер</option>
              </select>
              <select
                value={filters.language || ''}
                onChange={(e) => onFiltersChange({ ...filters, language: e.target.value || undefined })}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
              >
                <option value="">Все языки</option>
                <option value="ru-RU">Русский</option>
                <option value="en-US">English</option>
                <option value="tr-TR">Türkçe</option>
                <option value="kk-KZ">Қазақша</option>
              </select>
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex space-x-2">
            <button
              onClick={onExport}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
            >
              📁 Экспорт
            </button>
            <button
              onClick={onClear}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm"
            >
              🗑️ Очистить
            </button>
          </div>

          {/* Список истории */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                История пуста
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-dark-text font-medium truncate">
                        {item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                        <span>{getLanguageLabel(item.language)}</span>
                        <span>{getVoiceTypeLabel(item)}</span>
                        {item.voiceName && <span>{item.voiceName}</span>}
                        <span>{formatDate(item.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {item.audioUrl && (
                        <button
                          onClick={() => onPlay(item)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                          title="Воспроизвести"
                        >
                          ▶️
                        </button>
                      )}
                      <button
                        onClick={() => onLoad(item)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                        title="Загрузить в редактор"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 