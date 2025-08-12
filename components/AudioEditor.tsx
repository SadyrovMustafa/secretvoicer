import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AudioSegment, AudioProject, AudioEffect } from '../types/audio-editor';

interface AudioEditorProps {
  audioUrl?: string;
  onExport?: (audioBlob: Blob) => void;
  onSave?: (project: AudioProject) => void;
}

export const AudioEditor: React.FC<AudioEditorProps> = ({ 
  audioUrl, 
  onExport, 
  onSave 
}) => {
  const [project, setProject] = useState<AudioProject>({
    id: Date.now().toString(),
    name: 'Новый проект',
    segments: [],
    totalDuration: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showWaveform, setShowWaveform] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Инициализация проекта с загруженным аудио
  useEffect(() => {
    if (audioUrl && project.segments.length === 0) {
      const newSegment: AudioSegment = {
        id: '1',
        startTime: 0,
        endTime: 0, // будет установлено после загрузки
        audioUrl,
        volume: 1,
        speed: 1,
        pitch: 0,
      };
      
      setProject(prev => ({
        ...prev,
        segments: [newSegment],
      }));
    }
  }, [audioUrl, project.segments.length]);

  // Обработка воспроизведения
  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Обновление времени воспроизведения
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  // Перемотка к определенному времени
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Добавление нового сегмента
  const addSegment = useCallback((audioUrl: string, startTime: number = 0) => {
    const newSegment: AudioSegment = {
      id: Date.now().toString(),
      startTime,
      endTime: startTime + 10, // 10 секунд по умолчанию
      audioUrl,
      volume: 1,
      speed: 1,
      pitch: 0,
    };

    setProject(prev => ({
      ...prev,
      segments: [...prev.segments, newSegment],
      updatedAt: new Date(),
    }));
  }, []);

  // Удаление сегмента
  const removeSegment = useCallback((segmentId: string) => {
    setProject(prev => ({
      ...prev,
      segments: prev.segments.filter(s => s.id !== segmentId),
      updatedAt: new Date(),
    }));
    
    if (selectedSegmentId === segmentId) {
      setSelectedSegmentId(null);
    }
  }, [selectedSegmentId]);

  // Обновление сегмента
  const updateSegment = useCallback((segmentId: string, updates: Partial<AudioSegment>) => {
    setProject(prev => ({
      ...prev,
      segments: prev.segments.map(s => 
        s.id === segmentId ? { ...s, ...updates } : s
      ),
      updatedAt: new Date(),
    }));
  }, []);

  // Обрезка сегмента
  const trimSegment = useCallback((segmentId: string, startTime: number, endTime: number) => {
    updateSegment(segmentId, { startTime, endTime });
  }, [updateSegment]);

  // Соединение сегментов
  const mergeSegments = useCallback((segmentIds: string[]) => {
    if (segmentIds.length < 2) return;

    const segments = project.segments.filter(s => segmentIds.includes(s.id));
    const sortedSegments = segments.sort((a, b) => a.startTime - b.startTime);
    
    // Создаем новый объединенный сегмент
    const mergedSegment: AudioSegment = {
      id: Date.now().toString(),
      startTime: sortedSegments[0].startTime,
      endTime: sortedSegments[sortedSegments.length - 1].endTime,
      audioUrl: sortedSegments[0].audioUrl, // берем первый URL
      volume: 1,
      speed: 1,
      pitch: 0,
    };

    // Удаляем старые сегменты и добавляем объединенный
    setProject(prev => ({
      ...prev,
      segments: [
        ...prev.segments.filter(s => !segmentIds.includes(s.id)),
        mergedSegment
      ],
      updatedAt: new Date(),
    }));
  }, [project.segments]);

  // Экспорт проекта
  const handleExport = useCallback(async () => {
    if (!project.segments.length) return;

    try {
      // Здесь должна быть логика объединения всех сегментов в один аудиофайл
      // Пока что просто экспортируем первый сегмент
      const response = await fetch(project.segments[0].audioUrl);
      const blob = await response.blob();
      
      if (onExport) {
        onExport(blob);
      } else {
        // Скачивание по умолчанию
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name}.mp3`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  }, [project, onExport]);

  // Сохранение проекта
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(project);
    } else {
      // Сохранение в localStorage по умолчанию
      const projects = JSON.parse(localStorage.getItem('audioProjects') || '[]');
      const existingIndex = projects.findIndex((p: AudioProject) => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }
      
      localStorage.setItem('audioProjects', JSON.stringify(projects));
      alert('Проект сохранен!');
    }
  }, [project, onSave]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Аудио Редактор
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Экспорт
          </button>
        </div>
      </div>

      {/* Панель управления воспроизведением */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? 'Пауза' : 'Играть'}
        </button>
        <button
          onClick={handleStop}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Стоп
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Время:</span>
          <span className="font-mono text-sm">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Масштаб:</span>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      {/* Настройки отображения */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showWaveform}
            onChange={(e) => setShowWaveform(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Волновая форма</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Сетка</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(e) => setSnapToGrid(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Привязка к сетке</span>
        </label>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Размер сетки:</span>
          <select
            value={gridSize}
            onChange={(e) => setGridSize(parseFloat(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value={0.1}>0.1с</option>
            <option value={0.5}>0.5с</option>
            <option value={1}>1с</option>
            <option value={5}>5с</option>
          </select>
        </div>
      </div>

      {/* Временная шкала */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Временная шкала
          </h3>
          <button
            onClick={() => addSegment(audioUrl || '', currentTime)}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            + Сегмент
          </button>
        </div>
        
        <div 
          ref={timelineRef}
          className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border"
        >
          {/* Сетка времени */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: Math.ceil(project.totalDuration / gridSize) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-gray-300 dark:border-gray-600"
                  style={{ left: `${(i * gridSize * zoom * 100) / project.totalDuration}%` }}
                />
              ))}
            </div>
          )}
          
          {/* Сегменты */}
          {project.segments.map((segment) => (
            <div
              key={segment.id}
              className={`absolute top-2 bottom-2 rounded cursor-pointer transition-all ${
                selectedSegmentId === segment.id 
                  ? 'bg-blue-500 border-2 border-blue-700' 
                  : 'bg-blue-300 hover:bg-blue-400'
              }`}
              style={{
                left: `${(segment.startTime * zoom * 100) / project.totalDuration}%`,
                width: `${((segment.endTime - segment.startTime) * zoom * 100) / project.totalDuration}%`,
              }}
              onClick={() => setSelectedSegmentId(segment.id)}
            >
              <div className="px-2 py-1 text-xs text-white truncate">
                {segment.text || `Сегмент ${segment.id}`}
              </div>
            </div>
          ))}
          
          {/* Курсор воспроизведения */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
            style={{
              left: `${(currentTime * zoom * 100) / project.totalDuration}%`,
            }}
          />
        </div>
      </div>

      {/* Панель свойств сегмента */}
      {selectedSegmentId && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Свойства сегмента
          </h3>
          
          {(() => {
            const segment = project.segments.find(s => s.id === selectedSegmentId);
            if (!segment) return null;
            
            return (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Начало (сек)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={segment.startTime}
                    onChange={(e) => updateSegment(segment.id, { 
                      startTime: parseFloat(e.target.value) 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Конец (сек)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={segment.endTime}
                    onChange={(e) => updateSegment(segment.id, { 
                      endTime: parseFloat(e.target.value) 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Громкость
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={segment.volume}
                    onChange={(e) => updateSegment(segment.id, { 
                      volume: parseFloat(e.target.value) 
                    })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{segment.volume}</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Скорость
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={segment.speed}
                    onChange={(e) => updateSegment(segment.id, { 
                      speed: parseFloat(e.target.value) 
                    })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{segment.speed}x</span>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Текст
                  </label>
                  <input
                    type="text"
                    value={segment.text || ''}
                    onChange={(e) => updateSegment(segment.id, { 
                      text: e.target.value 
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Описание сегмента"
                  />
                </div>
                
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={() => removeSegment(segment.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Удалить сегмент
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Скрытый аудио элемент для воспроизведения */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={() => {
          if (audioRef.current && project.segments.length === 1) {
            const duration = audioRef.current.duration;
            updateSegment(project.segments[0].id, { endTime: duration });
            setProject(prev => ({ ...prev, totalDuration: duration }));
          }
        }}
      />
    </div>
  );
};
