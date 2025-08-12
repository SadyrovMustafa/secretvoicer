import { useState, useCallback, useRef } from 'react';
import { VoiceSettings, PlaybackSettings } from '../types/elevenlabs';
import { BarkSettings } from '../types/bark';

export type TTSStatus = 'idle' | 'waiting' | 'processing' | 'ready' | 'error';

export interface TTSOptions {
  language?: string;
  voice_id?: string;
  voice_settings?: VoiceSettings;
  playback_settings?: PlaybackSettings;
  bark_settings?: BarkSettings;
  use_elevenlabs?: boolean;
  use_bark?: boolean;
}

export const useTTS = () => {
  const [status, setStatus] = useState<TTSStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentAudioItem, setCurrentAudioItem] = useState<any>(null);
  const [karaokeIndex, setKaraokeIndex] = useState<number>(0);
  const [karaokeLength, setKaraokeLength] = useState<number>(0);
  const [karaokeActive, setKaraokeActive] = useState<boolean>(false);
  const [karaokeApproximate, setKaraokeApproximate] = useState<boolean>(false);
  const [karaokeText, setKaraokeText] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const lastTextRef = useRef<string>('');
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Упрощенная нормализация текста для лучшей синхронизации с SpeechSynthesis
  const normalizeForSpeech = (input: string): string => {
    try {
      const withoutEmoji = input.replace(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}]/gu, '');
      const withoutZW = withoutEmoji.replace(/[\u200B-\u200F\uFEFF]/g, '');
      const unifiedSpace = withoutZW.replace(/\s+/g, ' ').replace(/\u00A0/g, ' ');
      return unifiedSpace.trim();
    } catch {
      return input;
    }
  };

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    if (!text.trim()) {
      setError('Введите текст для озвучки');
      setStatus('error');
      return;
    }

    try {
      setStatus('waiting');
      setError(null);
      lastTextRef.current = text;
      setKaraokeIndex(0);
      setKaraokeLength(0);
      setKaraokeActive(true);
      setKaraokeApproximate(false);
      setKaraokeText(text);
      setIsPaused(false);

      if (options.use_bark && options.voice_id) {
        // Используем Bark API
        const response = await fetch('/api/bark-tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            language: options.language,
            voice_id: options.voice_id,
            settings: options.bark_settings,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Ошибка генерации аудио с Bark');
        }

        setStatus('processing');

        // Проверяем, нужно ли использовать браузерный fallback
        if (data.useBrowserFallback) {
          console.log('Using browser SpeechSynthesis fallback for Bark');
          // Используем браузерный SpeechSynthesis
          if (!window.speechSynthesis) {
            throw new Error('Браузер не поддерживает синтез речи');
          }

          window.speechSynthesis.cancel();
          const normalized = normalizeForSpeech(data.text);
          const utterance = new SpeechSynthesisUtterance(normalized);
          lastTextRef.current = normalized;
          setKaraokeText(normalized);
          utterance.lang = data.language || 'ru-RU';

          utterance.onstart = () => {
            setStatus('processing');
            setKaraokeActive(true);
            setKaraokeApproximate(false);
            setIsPaused(false);
          };

          utterance.onend = () => {
            setStatus('ready');
            setKaraokeActive(false);
            setIsPaused(false);
          };

          utterance.onerror = (event) => {
            setError(`Ошибка воспроизведения: ${event.error}`);
            setStatus('error');
            setKaraokeActive(false);
            setIsPaused(false);
          };

          // Подсветка слов через boundary-события
          (utterance as any).onboundary = (event: any) => {
            try {
              const idx = typeof event.charIndex === 'number' ? event.charIndex : 0;
              const src = lastTextRef.current || data.text || '';
              // Оценим длину текущего слова до ближайшего разделителя
              let len = 0;
              for (let i = idx; i < src.length; i++) {
                const ch = src[i];
                if (/\s|[.,!?;:()\[\]{}"'«»]/.test(ch)) break;
                len++;
              }
              setKaraokeIndex(idx);
              setKaraokeLength(Math.max(1, len));
            } catch {}
          };

          window.speechSynthesis.speak(utterance);
          // Для браузерного fallback не сохраняем URL
          setAudioUrl(null);
        } else {
          // Воспроизводим аудио из API и сохраняем URL для скачивания
          setAudioUrl(data.audioUrl);
          await playFromUrl(data.audioUrl);
        }
      } else if (options.use_elevenlabs && options.voice_id) {
        // Используем ElevenLabs API
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            language: options.language,
            voice_id: options.voice_id,
            voice_settings: options.voice_settings,
            playback_settings: options.playback_settings,
            use_elevenlabs: true,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Ошибка генерации аудио');
        }

        setStatus('processing');

        // Воспроизводим аудио и сохраняем URL для скачивания
        setAudioUrl(data.audioUrl);
        await playFromUrl(data.audioUrl);
      } else {
        // Используем браузерный SpeechSynthesis
        if (!window.speechSynthesis) {
          throw new Error('Браузер не поддерживает синтез речи');
        }

        window.speechSynthesis.cancel();

        const normalized = normalizeForSpeech(text);
        const utterance = new SpeechSynthesisUtterance(normalized);
        lastTextRef.current = normalized;
        setKaraokeText(normalized);
        utterance.lang = options.language || 'ru-RU';

        // Применяем настройки воспроизведения
        if (options.playback_settings) {
          utterance.rate = options.playback_settings.speed;
          utterance.pitch = options.playback_settings.pitch;
        } else {
          utterance.rate = 1;
          utterance.pitch = 1;
        }

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const preferredVoice = voices.find(voice => 
            voice.lang.startsWith(options.language || 'ru')
          ) || voices[0];
          utterance.voice = preferredVoice;
        }

        setStatus('processing');

        utterance.onstart = () => {
          setStatus('processing');
          setKaraokeActive(true);
          setKaraokeApproximate(false);
          setIsPaused(false);
        };

        utterance.onend = () => {
          setStatus('ready');
          setKaraokeActive(false);
          setIsPaused(false);
        };

        utterance.onerror = (event) => {
          setError(`Ошибка воспроизведения: ${event.error}`);
          setStatus('error');
          setKaraokeActive(false);
          setIsPaused(false);
        };

        (utterance as any).onboundary = (event: any) => {
          try {
            const idx = typeof event.charIndex === 'number' ? event.charIndex : 0;
            const src = lastTextRef.current || text || '';
            let len = 0;
            for (let i = idx; i < src.length; i++) {
              const ch = src[i];
              if (/\s|[.,!?;:()\[\]{}"'«»]/.test(ch)) break;
              len++;
            }
            setKaraokeIndex(idx);
            setKaraokeLength(Math.max(1, len));
          } catch {}
        };

        window.speechSynthesis.speak(utterance);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setStatus('error');
      setKaraokeActive(false);
      setIsPaused(false);
    }
  }, []);

  const playFromUrl = useCallback(async (url: string) => {
    try {
      setStatus('waiting');
      setError(null);

      const audio = new Audio(url);
      audioElRef.current = audio;
      setKaraokeApproximate(true);
      setIsPaused(false);
      
      audio.onloadstart = () => {
        setStatus('processing');
      };

      audio.oncanplay = () => {
        setStatus('ready');
      };

      audio.onended = () => {
        setStatus('ready');
        setKaraokeActive(false);
        setIsPaused(false);
      };

      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setError('Ошибка загрузки аудио. Проверьте формат файла.');
        setStatus('error');
        setKaraokeActive(false);
        setIsPaused(false);
      };

      // Добавляем обработчик для проверки готовности
      audio.onloadeddata = () => {
        console.log('Audio loaded successfully');
      };

      // Приблизительная караоке-подсветка по времени
      audio.ontimeupdate = () => {
        const src = lastTextRef.current;
        if (!src || !audio.duration || isNaN(audio.duration) || audio.duration <= 0) return;
        const ratio = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
        const idx = Math.floor(src.length * ratio);
        // выделяем слово вокруг индекса
        let start = idx;
        while (start > 0 && !/\s/.test(src[start - 1])) start--;
        let end = idx;
        while (end < src.length && !/\s/.test(src[end])) end++;
        setKaraokeIndex(start);
        setKaraokeLength(Math.max(1, end - start));
        setKaraokeActive(true);
      };

      audio.onpause = () => {
        setIsPaused(true);
      };
      audio.onplay = () => {
        setIsPaused(false);
      };

      await audio.play();

    } catch (err) {
      console.error('PlayFromUrl error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка воспроизведения');
      setStatus('error');
      setKaraokeActive(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
    }
    setStatus('idle');
    setError(null);
    setKaraokeActive(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    try {
      if (audioElRef.current && !audioElRef.current.paused) {
        audioElRef.current.pause();
        setIsPaused(true);
        return;
      }
      if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } catch {}
  }, []);

  const resume = useCallback(() => {
    try {
      if (audioElRef.current && audioElRef.current.paused) {
        void audioElRef.current.play();
        setIsPaused(false);
        return;
      }
      if (window.speechSynthesis && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    } catch {}
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setAudioUrl(null);
    setKaraokeIndex(0);
    setKaraokeLength(0);
    setKaraokeActive(false);
    setKaraokeApproximate(false);
  }, []);

  return {
    status,
    error,
    audioUrl,
    currentAudioItem,
    speak,
    playFromUrl,
    stop,
    pause,
    resume,
    reset,
    karaokeIndex,
    karaokeLength,
    karaokeActive,
    karaokeApproximate,
    isPaused,
  };
}; 