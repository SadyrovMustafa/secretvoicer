import { useState } from 'react';
import { VoiceSettings, PlaybackSettings } from '../types/elevenlabs';

interface VoiceSettingsProps {
  voiceSettings: VoiceSettings;
  playbackSettings: PlaybackSettings;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  onPlaybackSettingsChange: (settings: PlaybackSettings) => void;
}

export const VoiceSettingsPanel: React.FC<VoiceSettingsProps> = ({
  voiceSettings,
  playbackSettings,
  onVoiceSettingsChange,
  onPlaybackSettingsChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVoiceSettingChange = (key: keyof VoiceSettings, value: number | boolean) => {
    onVoiceSettingsChange({
      ...voiceSettings,
      [key]: value,
    });
  };

  const handlePlaybackSettingChange = (key: keyof PlaybackSettings, value: number) => {
    onPlaybackSettingsChange({
      ...playbackSettings,
      [key]: value,
    });
  };

  const handleEffectChange = (effect: 'echo' | 'reverb', enabled: boolean) => {
    onPlaybackSettingsChange({
      ...playbackSettings,
      effects: {
        ...playbackSettings.effects,
        [effect]: enabled,
      },
    });
  };

  const handleEffectLevelChange = (effect: 'echoLevel' | 'reverbLevel', value: number) => {
    onPlaybackSettingsChange({
      ...playbackSettings,
      effects: {
        ...playbackSettings.effects,
        [effect]: value,
      },
    });
  };

  return (
    <div className="bg-dark-card border border-gray-600 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold text-dark-text">Настройки голоса</h3>
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
        <div className="mt-4 space-y-6">
          {/* ElevenLabs Voice Settings */}
          <div>
            <h4 className="text-md font-medium text-dark-text mb-3">Параметры голоса</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Стабильность: {voiceSettings.stability}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={voiceSettings.stability}
                  onChange={(e) => handleVoiceSettingChange('stability', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Схожесть: {voiceSettings.similarity_boost}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={voiceSettings.similarity_boost}
                  onChange={(e) => handleVoiceSettingChange('similarity_boost', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Стиль: {voiceSettings.style}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={voiceSettings.style}
                  onChange={(e) => handleVoiceSettingChange('style', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="speaker_boost"
                  checked={voiceSettings.use_speaker_boost}
                  onChange={(e) => handleVoiceSettingChange('use_speaker_boost', e.target.checked)}
                  className="w-4 h-4 text-accent-yellow bg-gray-600 border-gray-500 rounded focus:ring-accent-yellow"
                />
                <label htmlFor="speaker_boost" className="ml-2 text-sm text-dark-text-secondary">
                  Улучшение голоса
                </label>
              </div>
            </div>
          </div>

          {/* Playback Settings */}
          <div>
            <h4 className="text-md font-medium text-dark-text mb-3">Воспроизведение</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Скорость: {playbackSettings.speed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={playbackSettings.speed}
                  onChange={(e) => handlePlaybackSettingChange('speed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Высота: {playbackSettings.pitch}
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={playbackSettings.pitch}
                  onChange={(e) => handlePlaybackSettingChange('pitch', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Громкость: {Math.round(playbackSettings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={playbackSettings.volume}
                  onChange={(e) => handlePlaybackSettingChange('volume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-dark-text-secondary mb-2">
                  Пауза между предложениями: {playbackSettings.pauseBetweenSentences}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={playbackSettings.pauseBetweenSentences}
                  onChange={(e) => handlePlaybackSettingChange('pauseBetweenSentences', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Effects */}
          <div>
            <h4 className="text-md font-medium text-dark-text mb-3">Эффекты</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="echo"
                    checked={playbackSettings.effects.echo}
                    onChange={(e) => handleEffectChange('echo', e.target.checked)}
                    className="w-4 h-4 text-accent-yellow bg-gray-600 border-gray-500 rounded focus:ring-accent-yellow"
                  />
                  <label htmlFor="echo" className="ml-2 text-sm text-dark-text-secondary">
                    Эхо
                  </label>
                </div>
                {playbackSettings.effects.echo && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={playbackSettings.effects.echoLevel}
                    onChange={(e) => handleEffectLevelChange('echoLevel', parseFloat(e.target.value))}
                    className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reverb"
                    checked={playbackSettings.effects.reverb}
                    onChange={(e) => handleEffectChange('reverb', e.target.checked)}
                    className="w-4 h-4 text-accent-yellow bg-gray-600 border-gray-500 rounded focus:ring-accent-yellow"
                  />
                  <label htmlFor="reverb" className="ml-2 text-sm text-dark-text-secondary">
                    Реверберация
                  </label>
                </div>
                {playbackSettings.effects.reverb && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={playbackSettings.effects.reverbLevel}
                    onChange={(e) => handleEffectLevelChange('reverbLevel', parseFloat(e.target.value))}
                    className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 