import React, { useCallback, useState } from 'react';

interface AudioUploaderProps {
  onAudioUpload: (audioUrl: string, fileName: string) => void;
  acceptedFormats?: string[];
  maxFileSize?: number; // в МБ
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAudioUpload,
  acceptedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'],
  maxFileSize = 50 // 50 МБ по умолчанию
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Проверка размера файла
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`Файл слишком большой. Максимальный размер: ${maxFileSize} МБ`);
      return false;
    }

    // Проверка формата файла
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Неподдерживаемый формат файла. Поддерживаемые форматы: ${acceptedFormats.join(', ')}`);
      return false;
    }

    return true;
  }, [maxFileSize, acceptedFormats]);

  const processFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setError(null);

    try {
      // Создаем URL для файла
      const audioUrl = URL.createObjectURL(file);
      onAudioUpload(audioUrl, file.name);
    } catch (err) {
      setError('Ошибка при обработке файла');
      console.error('Ошибка загрузки аудио:', err);
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, onAudioUpload]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('audio') !== -1) {
        const file = item.getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  }, [processFile]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        <div className="space-y-4">
          {/* Иконка */}
          <div className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>

          {/* Текст */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Загрузите аудио файл
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Перетащите файл сюда, вставьте из буфера обмена или нажмите для выбора
            </p>
          </div>

          {/* Поддерживаемые форматы */}
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Поддерживаемые форматы: {acceptedFormats.join(', ')}
            <br />
            Максимальный размер: {maxFileSize} МБ
          </div>

          {/* Кнопка выбора файла */}
          <div>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors">
              <input
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? 'Загрузка...' : 'Выбрать файл'}
            </label>
          </div>

          {/* Состояние загрузки */}
          {isUploading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Обработка файла...
              </span>
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Дополнительные опции */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Совет: Вы также можете вставить аудио из буфера обмена (Ctrl+V)
        </p>
      </div>
    </div>
  );
};
