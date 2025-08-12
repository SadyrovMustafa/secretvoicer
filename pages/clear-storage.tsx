import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ClearStoragePage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [storageData, setStorageData] = useState<string[]>([]);

  useEffect(() => {
    // Показываем текущее содержимое localStorage
    const data: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('secretvoicer')) {
        const value = localStorage.getItem(key);
        data.push(`${key}: ${value}`);
      }
    }
    setStorageData(data);
  }, []);

  const clearStorage = () => {
    try {
      localStorage.removeItem('secretvoicer_auth');
      localStorage.removeItem('secretvoicer_token');
      localStorage.removeItem('secretvoicer_users');
      localStorage.removeItem('secretvoicer_history');
      localStorage.removeItem('secretvoicer_admin_actions');
      
      setMessage('localStorage очищен! Теперь перейдите на главную страницу.');
      setStorageData([]);
    } catch (error) {
      setMessage(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Очистка localStorage</h1>
        
        <button
          onClick={clearStorage}
          className="mb-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Очистить localStorage
        </button>
        
        {message && (
          <div className={`p-4 rounded-lg mb-8 ${
            message.includes('очищен') ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Текущее содержимое localStorage:</h2>
          {storageData.length === 0 ? (
            <p className="text-gray-400">localStorage пуст</p>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg">
              {storageData.map((item, index) => (
                <div key={index} className="text-sm font-mono mb-2">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-x-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-yellow-600 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            На главную
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            В админку
          </button>
        </div>
      </div>
    </div>
  );
} 