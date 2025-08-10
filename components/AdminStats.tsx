import { AdminStats } from '../types/admin';

interface AdminStatsProps {
  stats: AdminStats;
}

export const AdminStatsComponent: React.FC<AdminStatsProps> = ({ stats }) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  const getPercentage = (part: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  const totalUsage = stats.barkUsage + stats.elevenlabsUsage + stats.browserUsage;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Пользователи */}
      <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Всего пользователей</p>
            <p className="text-2xl font-bold text-dark-text">{formatNumber(stats.totalUsers)}</p>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Активные</span>
            <span className="text-green-400">{formatNumber(stats.activeUsers)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Premium</span>
            <span className="text-yellow-400">{formatNumber(stats.premiumUsers)}</span>
          </div>
        </div>
      </div>

      {/* Озвучки */}
      <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Всего озвучек</p>
            <p className="text-2xl font-bold text-dark-text">{formatNumber(stats.totalVoiceovers)}</p>
          </div>
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Сегодня</span>
            <span className="text-green-400">{formatNumber(stats.todayVoiceovers)}</span>
          </div>
        </div>
      </div>

      {/* Использование TTS */}
      <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Использование TTS</p>
            <p className="text-2xl font-bold text-dark-text">{formatNumber(totalUsage)}</p>
          </div>
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Bark</span>
            <span className="text-blue-400">{formatNumber(stats.barkUsage)} ({getPercentage(stats.barkUsage, totalUsage)}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">ElevenLabs</span>
            <span className="text-green-400">{formatNumber(stats.elevenlabsUsage)} ({getPercentage(stats.elevenlabsUsage, totalUsage)}%)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Браузер</span>
            <span className="text-yellow-400">{formatNumber(stats.browserUsage)} ({getPercentage(stats.browserUsage, totalUsage)}%)</span>
          </div>
        </div>
      </div>

      {/* Активность */}
      <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Активность</p>
            <p className="text-2xl font-bold text-dark-text">{formatNumber(stats.activeUsers)}</p>
          </div>
          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Активных</span>
            <span className="text-green-400">{getPercentage(stats.activeUsers, stats.totalUsers)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Premium</span>
            <span className="text-yellow-400">{getPercentage(stats.premiumUsers, stats.totalUsers)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 