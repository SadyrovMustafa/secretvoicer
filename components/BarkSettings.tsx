import { useState } from 'react';
import { BarkSettings } from '../types/bark';

interface BarkSettingsProps {
  settings: BarkSettings;
  onSettingsChange: (settings: BarkSettings) => void;
}

export const BarkSettingsPanel: React.FC<BarkSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSettingChange = (key: keyof BarkSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="bg-dark-card border border-gray-600 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold text-dark-text">Настройки Bark</h3>
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
          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">
              Скорость: {settings.speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speed}
              onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">
              Температура: {settings.temperature}
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={settings.temperature}
              onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-dark-text-secondary mt-1">
              Контролирует случайность генерации (0 = детерминированный, 1 = максимально случайный)
            </p>
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">
              Top-K: {settings.top_k}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={settings.top_k}
              onChange={(e) => handleSettingChange('top_k', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-dark-text-secondary mt-1">
              Ограничивает выбор токенов только топ-K наиболее вероятными
            </p>
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">
              Top-P: {settings.top_p}
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={settings.top_p}
              onChange={(e) => handleSettingChange('top_p', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-dark-text-secondary mt-1">
              Nucleus sampling - выбирает из токенов с кумулятивной вероятностью P
            </p>
          </div>

          <div>
            <label className="block text-sm text-dark-text-secondary mb-2">
              Waveform Temperature: {settings.waveform_temp}
            </label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={settings.waveform_temp}
              onChange={(e) => handleSettingChange('waveform_temp', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-dark-text-secondary mt-1">
              Контролирует вариативность в генерации аудиоволны
            </p>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <h4 className="text-sm font-semibold text-dark-text mb-3">Дополнительные настройки качества</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Repetition Penalty: {settings.repetition_penalty || 1.0}
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.1"
                  value={settings.repetition_penalty || 1.0}
                  onChange={(e) => handleSettingChange('repetition_penalty', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-dark-text-secondary mt-1">
                  Штраф за повторения (1.0 = без штрафа, 1.2 = умеренный штраф)
                </p>
              </div>

              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Length Penalty: {settings.length_penalty || 1.0}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.length_penalty || 1.0}
                  onChange={(e) => handleSettingChange('length_penalty', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-dark-text-secondary mt-1">
                  Контроль длины аудио (1.0 = нормальная длина)
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-600">
              <h4 className="text-sm font-semibold text-dark-text mb-3">Быстрые профили</h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => onSettingsChange({
                    speed: 1.0,
                    temperature: 0.2,
                    top_k: 15,
                    top_p: 0.7,
                    waveform_temp: 0.3,
                    repetition_penalty: 1.2,
                    length_penalty: 1.0,
                  })}
                  className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                >
                  🎯 Максимальное качество
                </button>
                <button
                  onClick={() => onSettingsChange({
                    speed: 1.0,
                    temperature: 0.4,
                    top_k: 25,
                    top_p: 0.85,
                    waveform_temp: 0.5,
                    repetition_penalty: 1.1,
                    length_penalty: 1.0,
                  })}
                  className="px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                >
                  ⚡ Быстрая генерация
                </button>
                <button
                  onClick={() => onSettingsChange({
                    speed: 1.0,
                    temperature: 0.1,
                    top_k: 10,
                    top_p: 0.6,
                    waveform_temp: 0.2,
                    repetition_penalty: 1.3,
                    length_penalty: 0.9,
                  })}
                  className="px-3 py-2 text-xs bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
                >
                  🎭 Эмоциональный голос
                </button>
                <button
                  onClick={() => onSettingsChange({
                    speed: 1.0,
                    temperature: 0.3,
                    top_k: 20,
                    top_p: 0.8,
                    waveform_temp: 0.4,
                    repetition_penalty: 1.1,
                    length_penalty: 1.0,
                  })}
                  className="px-3 py-2 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  🔄 Сбросить к умолчанию
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 