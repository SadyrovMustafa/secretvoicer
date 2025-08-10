import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { LanguageSelector, Language } from '../components/LanguageSelector';
import { TextInput } from '../components/TextInput';
import { StatusBlock } from '../components/StatusBlock';
import { VoiceSelector } from '../components/VoiceSelector';
import { VoiceSettingsPanel } from '../components/VoiceSettings';
import { BarkVoiceSelector } from '../components/BarkVoiceSelector';
import { BarkSettingsPanel } from '../components/BarkSettings';
import { DownloadButton } from '../components/DownloadButton';
import { HistoryPanel } from '../components/HistoryPanel';
import { AudioPlayer } from '../components/AudioPlayer';
import { KaraokeText } from '../components/KaraokeText';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { AudioEditor } from '../components/AudioEditor';
import { AudioUploader } from '../components/AudioUploader';
import { useTTS } from '../hooks/useTTS';
import { useHistory } from '../hooks/useHistory';
import { useAuth } from '../hooks/useAuth';
import { VoiceSettings, PlaybackSettings } from '../types/elevenlabs';
import { BarkSettings } from '../types/bark';
import { AudioProject } from '../types/audio-editor';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('RU');
  const [text, setText] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [useElevenLabs, setUseElevenLabs] = useState(false);
  const [useBark, setUseBark] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
  });
  const [playbackSettings, setPlaybackSettings] = useState<PlaybackSettings>({
    speed: 1.0,
    pitch: 0,
    volume: 1.0,
    pauseBetweenSentences: 500,
    effects: {
      echo: false,
      reverb: false,
      echoLevel: 0.5,
      reverbLevel: 0.5,
    },
  });
  const [barkSettings, setBarkSettings] = useState<BarkSettings>({
    speed: 1.0,
    temperature: 0.3, // Снижаем для более стабильного голоса
    top_k: 20, // Уменьшаем для более предсказуемого результата
    top_p: 0.8, // Оптимальное значение для качества
    waveform_temp: 0.4, // Снижаем для более естественного звука
    repetition_penalty: 1.1, // Штраф за повторения
    length_penalty: 1.0, // Контроль длины
  });
  
  // Состояние для аудио редактора
  const [showAudioEditor, setShowAudioEditor] = useState(false);
  const [editorAudioUrl, setEditorAudioUrl] = useState<string | null>(null);
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([]);
  
  const { status, error, audioUrl, speak, stop, pause, resume, isPaused, reset, karaokeIndex, karaokeLength, karaokeActive, karaokeApproximate, } = useTTS();
  const { history, addToHistory, removeFromHistory, clearHistory, exportHistory, filters, setFilters } = useHistory();
  const { user, isAuthenticated, isLoading, error: authError, login, register, logout, updateUserSettings } = useAuth();

  // Загрузка сохраненных аудио проектов
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('audioProjects');
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        setAudioProjects(projects);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  }, []);

  // Определяем язык для TTS на основе выбранного языка
  const languageMap: Record<Language, string> = {
    'RU': 'ru-RU',
    'EN': 'en-US',
    'TR': 'tr-TR',
    'KZ': 'kk-KZ',
  };

  const handleSpeak = async () => {
    if (!text.trim()) return;

    const ttsOptions = {
      language: languageMap[currentLanguage],
      voice_id: selectedVoiceId || undefined,
      voice_settings: useElevenLabs ? voiceSettings : undefined,
      playback_settings: playbackSettings,
      bark_settings: useBark ? barkSettings : undefined,
      use_elevenlabs: useElevenLabs,
      use_bark: useBark,
    };

    await speak(text, ttsOptions);

    // Добавляем в историю после успешного озвучивания
    if (status === 'ready') {
      const voiceName = useBark ? 'Bark Voice' : useElevenLabs ? 'ElevenLabs Voice' : 'Browser Voice';
      addToHistory({
        text,
        language: languageMap[currentLanguage],
        voiceId: selectedVoiceId || undefined,
        voiceName,
        useBark,
        useElevenLabs,
        audioUrl: audioUrl || undefined,
        settings: {
          bark: useBark ? barkSettings : undefined,
          elevenlabs: useElevenLabs ? voiceSettings : undefined,
          playback: playbackSettings,
        },
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleSubscription = () => {
    // TODO: Реализовать логику подписки
    console.log('Subscription clicked');
  };

  const handleHistoryPlay = (item: any) => {
    if (item.audioUrl) {
      // Воспроизводим аудио из истории
      const audio = new Audio(item.audioUrl);
      audio.play().catch(error => {
        console.error('Play error:', error);
      });
    }
  };

  const handleHistoryLoad = (item: any) => {
    // Загружаем настройки из истории
    setText(item.text);
    if (item.settings?.bark) {
      setUseBark(true);
      setUseElevenLabs(false);
      setBarkSettings(item.settings.bark);
    } else if (item.settings?.elevenlabs) {
      setUseElevenLabs(true);
      setUseBark(false);
      setVoiceSettings(item.settings.elevenlabs);
    }
    if (item.settings?.playback) {
      setPlaybackSettings(item.settings.playback);
    }
    if (item.voiceId) {
      setSelectedVoiceId(item.voiceId);
    }
  };

  // Функции для аудио редактора
  const handleOpenAudioEditor = () => {
    setShowAudioEditor(true);
    setEditorAudioUrl(audioUrl || null);
  };

  const handleCloseAudioEditor = () => {
    setShowAudioEditor(false);
    setEditorAudioUrl(null);
  };

  const handleAudioUpload = (audioUrl: string, fileName: string) => {
    setEditorAudioUrl(audioUrl);
    setShowAudioEditor(true);
  };

  const handleSaveProject = (project: AudioProject) => {
    const updatedProjects = [...audioProjects];
    const existingIndex = updatedProjects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = project;
    } else {
      updatedProjects.push(project);
    }
    
    setAudioProjects(updatedProjects);
    
    // Сохраняем в localStorage
    localStorage.setItem('audioProjects', JSON.stringify(updatedProjects));
  };

  const handleExportAudio = (audioBlob: Blob) => {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-audio.mp3';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Показываем форму авторизации если пользователь не авторизован
  if (!isAuthenticated) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-yellow mx-auto mb-4"></div>
            <p className="text-dark-text">Загрузка...</p>
          </div>
        </div>
      );
    }

    return showRegister ? (
      <RegisterForm
        onRegister={register}
        onSwitchToLogin={() => setShowRegister(false)}
        isLoading={isLoading}
        error={authError}
      />
    ) : (
      <LoginForm
        onLogin={login}
        onSwitchToRegister={() => setShowRegister(true)}
        isLoading={isLoading}
        error={authError}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Secret Voicer - Текст в речь</title>
        <meta name="description" content="Современный сервис для озвучивания текста" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="bg-dark-card border-b border-gray-600 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-dark-text">Secret Voicer</h1>
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            </div>
            
                                      <div className="flex items-center space-x-4">
               <span className="text-dark-text">
                 Привет, {user?.username || 'Пользователь'}!
               </span>
               {user?.isAdmin && (
                 <a
                   href="/admin"
                   className="px-4 py-2 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-black transition-colors"
                 >
                   🔧 Админка
                 </a>
               )}
               <button
                 onClick={handleSubscription}
                 className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors"
               >
                 Подписка
               </button>
               <button
                 onClick={handleLogout}
                 className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-colors"
               >
                 Выйти
               </button>
             </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Voice Selection and Settings */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="use_bark"
                  checked={useBark}
                  onChange={(e) => {
                    setUseBark(e.target.checked);
                    if (e.target.checked) setUseElevenLabs(false);
                  }}
                  className="w-4 h-4 text-accent-yellow bg-gray-600 border-gray-500 rounded focus:ring-accent-yellow"
                />
                <label htmlFor="use_bark" className="ml-2 text-dark-text">
                  Использовать Bark (бесплатные AI голоса)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="use_elevenlabs"
                  checked={useElevenLabs}
                  onChange={(e) => {
                    setUseElevenLabs(e.target.checked);
                    if (e.target.checked) setUseBark(false);
                  }}
                  className="w-4 h-4 text-accent-yellow bg-gray-600 border-gray-500 rounded focus:ring-accent-yellow"
                />
                <label htmlFor="use_elevenlabs" className="ml-2 text-dark-text">
                  Использовать ElevenLabs (профессиональные голоса)
                </label>
              </div>
            </div>

            {useBark && (
              <BarkVoiceSelector
                selectedVoiceId={selectedVoiceId}
                onVoiceChange={setSelectedVoiceId}
                language={languageMap[currentLanguage]}
              />
            )}

            {useElevenLabs && (
              <VoiceSelector
                selectedVoiceId={selectedVoiceId}
                onVoiceChange={setSelectedVoiceId}
                language={languageMap[currentLanguage]}
              />
            )}

            {useBark && (
              <BarkSettingsPanel
                settings={barkSettings}
                onSettingsChange={setBarkSettings}
              />
            )}

            {useElevenLabs && (
              <VoiceSettingsPanel
                voiceSettings={voiceSettings}
                playbackSettings={playbackSettings}
                onVoiceSettingsChange={setVoiceSettings}
                onPlaybackSettingsChange={setPlaybackSettings}
              />
            )}
          </div>

          <div className="bg-dark-card rounded-lg p-6 border border-gray-600">
            <TextInput
              value={text}
              onChange={setText}
              onSpeak={handleSpeak}
              disabled={status === 'processing' || status === 'waiting'}
            />
          </div>

          <StatusBlock status={status} error={error} />

          {/* Контролы процесса */}
          {(status === 'processing' || status === 'waiting') && (
            <div>
              <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
                <button
                  onClick={stop}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-500 transition-colors"
                  title="Остановить"
                >
                  Стоп
                </button>
                {!isPaused ? (
                  <button
                    onClick={pause}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-colors"
                    title="Пауза"
                  >
                    Пауза
                  </button>
                ) : (
                  <button
                    onClick={resume}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 transition-colors"
                    title="Продолжить"
                  >
                    Продолжить
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Караоке подсветка */}
          <KaraokeText
            text={text}
            highlightIndex={karaokeIndex}
            highlightLength={karaokeLength}
            isActive={karaokeActive}
            isApproximate={karaokeApproximate}
            scrollAlign="bottom"
            scrollMarginPx={24}
          />

          {/* Аудио плеер */}
          {audioUrl && (
            <div className="mt-4">
              <AudioPlayer
                audioUrl={audioUrl}
                onEnded={() => console.log('Audio ended')}
                onError={(error) => console.error('Audio error:', error)}
              />
            </div>
          )}

          {/* Action buttons when ready */}
          {status === 'ready' && (
            <div className="mt-4 flex justify-center space-x-4">
              <DownloadButton
                audioUrl={audioUrl}
                text={text}
                disabled={!audioUrl}
              />
              {audioUrl && (
                <button
                  onClick={handleOpenAudioEditor}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Редактировать аудио</span>
                </button>
              )}
              {!audioUrl && (
                <button
                  onClick={() => {
                    // Для браузерного TTS показываем уведомление
                    alert('Для скачивания аудио выберите Bark или ElevenLabs в настройках голоса');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Информация о скачивании</span>
                </button>
              )}
              <button
                onClick={reset}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Сбросить статус
              </button>
            </div>
          )}

          {/* История озвучки */}
          <div className="mt-6">
            <HistoryPanel
              history={history}
              onRemove={removeFromHistory}
              onClear={clearHistory}
              onExport={exportHistory}
              onPlay={handleHistoryPlay}
              onLoad={handleHistoryLoad}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Аудио редактор */}
          {showAudioEditor && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-dark-text">Аудио Редактор</h2>
                <button
                  onClick={handleCloseAudioEditor}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Закрыть
                </button>
              </div>
              
              {editorAudioUrl ? (
                <AudioEditor
                  audioUrl={editorAudioUrl}
                  onExport={handleExportAudio}
                  onSave={handleSaveProject}
                />
              ) : (
                <AudioUploader onAudioUpload={handleAudioUpload} />
              )}
            </div>
          )}

          {/* Загрузчик аудио файлов (когда редактор не открыт) */}
          {!showAudioEditor && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-dark-text">Загрузка аудио файлов</h2>
                <button
                  onClick={() => setShowAudioEditor(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Открыть редактор
                </button>
              </div>
              <AudioUploader onAudioUpload={handleAudioUpload} />
            </div>
          )}
        </main>
      </div>
    </>
  );
} 