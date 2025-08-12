import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { useReferral } from '../hooks/useReferral';
import { ReferralProgram, ReferralStats } from '../types/auth';

interface AdminReferralsProps {
  user: User;
}

export const AdminReferrals: React.FC<AdminReferralsProps> = ({ user }) => {
  const { 
    referralProgram, 
    referralStats, 
    saveReferralProgram,
    getGlobalReferralStats 
  } = useReferral();
  
  const [editingProgram, setEditingProgram] = useState<ReferralProgram>(referralProgram);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<ReferralStats>(referralStats);

  useEffect(() => {
    const updateStats = () => {
      const globalStats = getGlobalReferralStats();
      setStats(globalStats);
    };
    
    updateStats();
    const interval = setInterval(updateStats, 30000); // Обновляем каждые 30 секунд
    
    return () => clearInterval(interval);
  }, [getGlobalReferralStats]);

  const handleSaveProgram = () => {
    saveReferralProgram(editingProgram);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingProgram(referralProgram);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark-text">Управление реферальной программой</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-accent-yellow hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
        >
          {isEditing ? 'Отменить' : 'Редактировать'}
        </button>
      </div>

      {/* Конфигурация программы */}
      <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Настройки программы</h3>
        
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Процент комиссии (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editingProgram.commissionRate * 100}
                onChange={(e) => setEditingProgram(prev => ({
                  ...prev,
                  commissionRate: parseFloat(e.target.value) / 100
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Бонус за реферала (₽)
              </label>
              <input
                type="number"
                min="0"
                value={editingProgram.referralBonus}
                onChange={(e) => setEditingProgram(prev => ({
                  ...prev,
                  referralBonus: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Минимум рефералов для бонуса
              </label>
              <input
                type="number"
                min="1"
                value={editingProgram.minReferralsForBonus}
                onChange={(e) => setEditingProgram(prev => ({
                  ...prev,
                  minReferralsForBonus: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Бонус за достижение минимума (₽)
              </label>
              <input
                type="number"
                min="0"
                value={editingProgram.bonusAmount}
                onChange={(e) => setEditingProgram(prev => ({
                  ...prev,
                  bonusAmount: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Дни активности реферала
              </label>
              <input
                type="number"
                min="1"
                value={editingProgram.expirationDays}
                onChange={(e) => setEditingProgram(prev => ({
                  ...prev,
                  expirationDays: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent-yellow mb-1">
                {Math.round(referralProgram.commissionRate * 100)}%
              </div>
              <div className="text-gray-400 text-sm">Комиссия</div>
            </div>
            
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {referralProgram.referralBonus}₽
              </div>
              <div className="text-gray-400 text-sm">Бонус за реферала</div>
            </div>
            
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {referralProgram.bonusAmount}₽
              </div>
              <div className="text-gray-400 text-sm">Бонус за минимум</div>
            </div>
            
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {referralProgram.minReferralsForBonus}
              </div>
              <div className="text-gray-400 text-sm">Минимум рефералов</div>
            </div>
            
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {referralProgram.expirationDays}
              </div>
              <div className="text-gray-400 text-sm">Дней активности</div>
            </div>
          </div>
        )}
        
        {isEditing && (
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSaveProgram}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
            >
              Сохранить
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
            >
              Отмена
            </button>
          </div>
        )}
      </div>

      {/* Общая статистика */}
      <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Общая статистика</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent-yellow mb-1">
              {stats.totalReferrals}
            </div>
            <div className="text-gray-400 text-sm">Всего рефералов</div>
          </div>
          
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.activeReferrals}
            </div>
            <div className="text-gray-400 text-sm">Активных</div>
          </div>
          
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {stats.monthlyReferrals}
            </div>
            <div className="text-gray-400 text-sm">За месяц</div>
          </div>
          
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {formatCurrency(stats.totalEarnings)}
            </div>
            <div className="text-gray-400 text-sm">Общий доход</div>
          </div>
        </div>
      </div>

      {/* Топ рефереров */}
      <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Топ рефереров</h3>
        {stats.topReferrers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-gray-300">Пользователь</th>
                  <th className="text-center py-3 px-4 text-gray-300">Рефералов</th>
                  <th className="text-center py-3 px-4 text-gray-300">Доход</th>
                </tr>
              </thead>
              <tbody>
                {stats.topReferrers.map((referrer, index) => (
                  <tr key={referrer.userId} className="border-b border-gray-700 hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-dark-text">{referrer.username}</div>
                        <div className="text-gray-400 text-xs">{referrer.email}</div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-accent-yellow font-semibold">
                        {referrer.totalReferrals}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(referrer.totalEarnings)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            Пока нет данных о реферерах
          </div>
        )}
      </div>
    </div>
  );
};
