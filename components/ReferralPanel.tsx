import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { useReferral } from '../hooks/useReferral';

interface ReferralPanelProps {
  user: User;
}

export const ReferralPanel: React.FC<ReferralPanelProps> = ({ user }) => {
  const { referralProgram, getUserReferralStats, generateReferralCode } = useReferral();
  const [userStats, setUserStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user.id) {
      const stats = getUserReferralStats(user.id);
      setUserStats(stats);
    }
  }, [user.id, getUserReferralStats]);

  const copyReferralCode = async () => {
    if (user.referralCode) {
      try {
        await navigator.clipboard.writeText(user.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy referral code:', error);
      }
    }
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Присоединяйтесь к Secret Voicer!',
        text: 'Используйте мой реферальный код для получения бонусов',
        url: referralLink,
      });
    } else {
      // Fallback для браузеров без поддержки Web Share API
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark-text">Реферальная программа</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Комиссия:</span>
          <span className="text-accent-yellow font-semibold">
            {Math.round(referralProgram.commissionRate * 100)}%
          </span>
        </div>
      </div>

      {/* Реферальный код */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">Ваш реферальный код</h3>
            <p className="text-gray-400 text-sm mb-3">
              Поделитесь этим кодом с друзьями и получайте бонусы за каждого приглашенного пользователя
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent-yellow mb-2">
              {user.referralCode || 'Генерация...'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyReferralCode}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-dark-text rounded-lg transition-colors"
              >
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
              <button
                onClick={shareReferralLink}
                className="px-4 py-2 bg-accent-yellow hover:bg-yellow-400 text-black font-semibold rounded-lg transition-colors"
              >
                Поделиться
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent-yellow mb-1">
            {userStats.totalReferrals}
          </div>
          <div className="text-gray-400 text-sm">Всего рефералов</div>
        </div>
        
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {userStats.activeReferrals}
          </div>
          <div className="text-gray-400 text-sm">Активных</div>
        </div>
        
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {userStats.completedReferrals}
          </div>
          <div className="text-gray-400 text-sm">Завершенных</div>
        </div>
        
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {formatCurrency(userStats.totalEarnings)}
          </div>
          <div className="text-gray-400 text-sm">Общий доход</div>
        </div>
      </div>

      {/* Доходы */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Ваши доходы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {formatCurrency(userStats.pendingEarnings)}
            </div>
            <div className="text-gray-400 text-sm">Ожидающие выплаты</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-yellow mb-2">
              {formatCurrency(userStats.totalEarnings)}
            </div>
            <div className="text-gray-400 text-sm">Общий доход</div>
          </div>
        </div>
      </div>

      {/* Условия программы */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Условия программы</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
            <span>
              <span className="font-semibold">{referralProgram.referralBonus}₽</span> за каждого приглашенного пользователя
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
            <span>
              <span className="font-semibold">{Math.round(referralProgram.commissionRate * 100)}%</span> комиссия с каждой оплаты реферала
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
            <span>
              <span className="font-semibold">{referralProgram.bonusAmount}₽</span> бонус при достижении {referralProgram.minReferralsForBonus} рефералов
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent-yellow rounded-full"></div>
            <span>
              Реферал активен {referralProgram.expirationDays} дней после регистрации
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка вывода средств */}
      {userStats.pendingEarnings > 0 && (
        <div className="mt-6 text-center">
          <button className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors">
            Вывести {formatCurrency(userStats.pendingEarnings)}
          </button>
          <p className="text-gray-400 text-sm mt-2">
            Минимальная сумма для вывода: 500₽
          </p>
        </div>
      )}
    </div>
  );
};
