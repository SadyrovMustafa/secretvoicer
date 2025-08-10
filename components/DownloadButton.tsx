import { useState } from 'react';

interface DownloadButtonProps {
  audioUrl: string | null;
  text: string;
  disabled?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  audioUrl,
  text,
  disabled = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!audioUrl || disabled) return;

    try {
      setIsDownloading(true);

      // Создаем временную ссылку для скачивания
      const link = document.createElement('a');
      link.href = audioUrl;
      
      // Генерируем имя файла на основе текста
      const fileName = text.length > 50 
        ? `${text.substring(0, 50).replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}...`
        : text.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
      
      link.download = `${fileName}_audio.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Небольшая задержка для UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Скачивание...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Скачать аудио</span>
        </>
      )}
    </button>
  );
}; 