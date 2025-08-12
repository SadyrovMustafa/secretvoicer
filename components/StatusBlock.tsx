import { TTSStatus } from '../hooks/useTTS';

interface StatusBlockProps {
  status: TTSStatus;
  error?: string | null;
}

const statusConfig = {
  idle: {
    label: 'Ожидание',
    color: 'bg-gray-500',
    textColor: 'text-gray-300',
  },
  waiting: {
    label: 'Ожидание',
    color: 'bg-blue-500',
    textColor: 'text-blue-300',
  },
  processing: {
    label: 'В процессе',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-300',
  },
  ready: {
    label: 'Готово',
    color: 'bg-green-500',
    textColor: 'text-green-300',
  },
  error: {
    label: 'Ошибка',
    color: 'bg-red-500',
    textColor: 'text-red-300',
  },
};

export const StatusBlock: React.FC<StatusBlockProps> = ({ status, error }) => {
  const config = statusConfig[status];

  return (
    <div className="mt-6 p-4 bg-dark-card rounded-lg border border-gray-600">
      <div className="flex items-center space-x-3">
        <span className="text-dark-text font-medium">Статус задачи:</span>
        <div className={`px-3 py-1 rounded ${config.color} ${config.textColor} font-medium`}>
          {config.label}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {status === 'ready' && (
        <div className="mt-2 text-green-400 text-sm">
          Текст успешно озвучен!
        </div>
      )}
    </div>
  );
}; 