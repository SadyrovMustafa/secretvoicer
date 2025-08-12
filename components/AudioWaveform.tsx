import React, { useRef, useEffect, useState, useCallback } from 'react';

interface AudioWaveformProps {
  audioUrl: string;
  width: number;
  height: number;
  showGrid?: boolean;
  gridSize?: number;
  onTimeClick?: (time: number) => void;
  currentTime?: number;
  duration?: number;
  segments?: Array<{
    id: string;
    startTime: number;
    endTime: number;
    color?: string;
  }>;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  width,
  height,
  showGrid = true,
  gridSize = 0.5,
  onTimeClick,
  currentTime = 0,
  duration = 0,
  segments = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [waveformData, setWaveformData] = useState<Float32Array | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Инициализация AudioContext и загрузка аудио
  useEffect(() => {
    if (!audioUrl) return;

    const loadAudio = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Создаем AudioContext
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        
        // Загружаем аудио файл
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Декодируем аудио
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Получаем данные канала (берем первый канал)
        const channelData = audioBuffer.getChannelData(0);
        
        // Упрощаем данные для отображения
        const samples = 1000; // количество точек для отображения
        const blockSize = Math.floor(channelData.length / samples);
        const filteredData = new Float32Array(samples);
        
        for (let i = 0; i < samples; i++) {
          const blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[blockStart + j]);
          }
          filteredData[i] = sum / blockSize;
        }
        
        setWaveformData(filteredData);
        
        // Обновляем duration если не передан
        if (duration === 0) {
          // duration будет обновлен через onTimeClick callback
        }
        
      } catch (err) {
        console.error('Ошибка загрузки аудио:', err);
        setError('Не удалось загрузить аудио файл');
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    // Очистка при размонтировании
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioUrl, duration]);

  // Отрисовка волновой формы
  useEffect(() => {
    if (!canvasRef.current || !waveformData || !duration) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);

    // Настройки отрисовки
    const centerY = height / 2;
    const barWidth = width / waveformData.length;
    const maxAmplitude = Math.max(...Array.from(waveformData));

    // Рисуем сетку
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= Math.ceil(duration / gridSize); i++) {
        const x = (i * gridSize * width) / duration;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Рисуем сегменты
    segments.forEach(segment => {
      const startX = (segment.startTime * width) / duration;
      const endX = (segment.endTime * width) / duration;
      const segmentWidth = endX - startX;
      
      ctx.fillStyle = segment.color || 'rgba(59, 130, 246, 0.1)';
      ctx.fillRect(startX, 0, segmentWidth, height);
      
      // Границы сегмента
      ctx.strokeStyle = segment.color || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, 0, segmentWidth, height);
    });

    // Рисуем волновую форму
    ctx.fillStyle = '#3b82f6';
    waveformData.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = (amplitude / maxAmplitude) * (height / 2);
      
      // Рисуем симметрично относительно центра
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight * 2);
    });

    // Рисуем курсор времени
    if (currentTime > 0) {
      const cursorX = (currentTime * width) / duration;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, height);
      ctx.stroke();
    }

  }, [waveformData, duration, width, height, showGrid, gridSize, segments, currentTime]);

  // Обработка клика по временной шкале
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onTimeClick || !duration) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const time = (x / width) * duration;
    
    onTimeClick(Math.max(0, Math.min(time, duration)));
  }, [onTimeClick, duration, width]);

  // Обработка перетаскивания
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleCanvasClick(event);
  }, [handleCanvasClick]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && onTimeClick && duration) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const time = (x / width) * duration;
      
      onTimeClick(Math.max(0, Math.min(time, duration)));
    }
  }, [isDragging, onTimeClick, duration, width]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Обработка ухода мыши с canvas
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Загрузка волновой формы...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-500" style={{ width, height }}>
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ touchAction: 'none' }}
      />
      
      {/* Временные метки */}
      {showGrid && duration > 0 && (
        <div className="absolute top-0 left-0 right-0 pointer-events-none">
          {Array.from({ length: Math.ceil(duration / gridSize) + 1 }).map((_, i) => {
            const time = i * gridSize;
            const x = (time * width) / duration;
            
            return (
              <div
                key={i}
                className="absolute top-1 text-xs text-gray-500 dark:text-gray-400"
                style={{ left: x - 15 }}
              >
                {Math.floor(time / 60)}:{(time % 60).toFixed(1).padStart(4, '0')}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
