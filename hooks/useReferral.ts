import { useState, useEffect, useCallback } from 'react';
import { 
  ReferralProgram, 
  ReferralStats, 
  ReferralHistoryItem, 
  TopReferrer,
  User 
} from '../types/auth';

const REFERRAL_STORAGE_KEY = 'secretvoicer_referral_program';
const REFERRAL_HISTORY_KEY = 'secretvoicer_referral_history';

// Конфигурация реферальной программы
const DEFAULT_REFERRAL_PROGRAM: ReferralProgram = {
  commissionRate: 0.15, // 15% комиссия
  minReferralsForBonus: 5, // Минимум 5 рефералов для бонуса
  bonusAmount: 1000, // 1000 рублей бонус
  referralBonus: 100, // 100 рублей за каждого реферала
  expirationDays: 30, // 30 дней до истечения
};

export const useReferral = () => {
  const [referralProgram, setReferralProgram] = useState<ReferralProgram>(DEFAULT_REFERRAL_PROGRAM);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    monthlyReferrals: 0,
    topReferrers: [],
  });

  // Загружаем конфигурацию реферальной программы
  useEffect(() => {
    const savedProgram = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (savedProgram) {
      try {
        setReferralProgram(JSON.parse(savedProgram));
      } catch (error) {
        console.error('Error loading referral program:', error);
      }
    }
  }, []);

  // Сохраняем конфигурацию реферальной программы
  const saveReferralProgram = useCallback((program: ReferralProgram) => {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(program));
    setReferralProgram(program);
  }, []);

  // Генерируем уникальный реферальный код
  const generateReferralCode = useCallback((userId: string, username: string): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const usernamePart = username.toLowerCase().replace(/[^a-z0-9]/g, '').substr(0, 3);
    return `${usernamePart}${timestamp}${random}`.toUpperCase();
  }, []);

  // Создаем реферальную запись
  const createReferral = useCallback((
    referrerId: string,
    referrerUsername: string,
    referredUserId: string,
    referredUserEmail: string,
    referredUsername: string
  ): ReferralHistoryItem => {
    const referral: ReferralHistoryItem = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      referredUserId,
      referredUserEmail,
      referredUsername,
      status: 'pending',
      createdAt: Date.now(),
      earnings: referralProgram.referralBonus,
      commission: referralProgram.commissionRate,
    };

    // Сохраняем в историю
    const history = getReferralHistory();
    history.push(referral);
    saveReferralHistory(history);

    return referral;
  }, [referralProgram]);

  // Активируем реферала (когда он совершает первое действие)
  const activateReferral = useCallback((referralId: string): boolean => {
    const history = getReferralHistory();
    const referralIndex = history.findIndex(r => r.id === referralId);
    
    if (referralIndex === -1) return false;

    history[referralIndex] = {
      ...history[referralIndex],
      status: 'active',
      activatedAt: Date.now(),
    };

    saveReferralHistory(history);
    return true;
  }, []);

  // Завершаем реферала (когда он оплачивает подписку)
  const completeReferral = useCallback((referralId: string, amount: number): boolean => {
    const history = getReferralHistory();
    const referralIndex = history.findIndex(r => r.id === referralId);
    
    if (referralIndex === -1) return false;

    const commission = amount * referralProgram.commissionRate;
    history[referralIndex] = {
      ...history[referralIndex],
      status: 'completed',
      earnings: amount,
      commission,
    };

    saveReferralHistory(history);
    return true;
  }, [referralProgram.commissionRate]);

  // Получаем историю рефералов
  const getReferralHistory = useCallback((): ReferralHistoryItem[] => {
    try {
      const history = localStorage.getItem(REFERRAL_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading referral history:', error);
      return [];
    }
  }, []);

  // Сохраняем историю рефералов
  const saveReferralHistory = useCallback((history: ReferralHistoryItem[]) => {
    localStorage.setItem(REFERRAL_HISTORY_KEY, JSON.stringify(history));
  }, []);

  // Получаем статистику рефералов для пользователя
  const getUserReferralStats = useCallback((userId: string) => {
    const history = getReferralHistory();
    const userReferrals = history.filter(r => r.referredUserId === userId);
    
    return {
      totalReferrals: userReferrals.length,
      activeReferrals: userReferrals.filter(r => r.status === 'active').length,
      completedReferrals: userReferrals.filter(r => r.status === 'completed').length,
      totalEarnings: userReferrals.reduce((sum, r) => sum + r.earnings, 0),
      pendingEarnings: userReferrals.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.earnings, 0),
    };
  }, [getReferralHistory]);

  // Получаем общую статистику рефералов
  const getGlobalReferralStats = useCallback((): ReferralStats => {
    const history = getReferralHistory();
    const now = Date.now();
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

    const totalReferrals = history.length;
    const activeReferrals = history.filter(r => r.status === 'active').length;
    const totalEarnings = history.reduce((sum, r) => sum + r.earnings, 0);
    const pendingEarnings = history.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.earnings, 0);
    const monthlyReferrals = history.filter(r => r.createdAt >= monthAgo).length;

    // Топ рефереров
    const referrerStats = new Map<string, { referrals: number; earnings: number; username: string; email: string }>();
    
    history.forEach(referral => {
      const referrerId = referral.referredUserId; // В данном случае это упрощенно
      if (!referrerStats.has(referrerId)) {
        referrerStats.set(referrerId, { referrals: 0, earnings: 0, username: '', email: '' });
      }
      const stats = referrerStats.get(referrerId)!;
      stats.referrals += 1;
      stats.earnings += referral.earnings;
    });

    const topReferrers: TopReferrer[] = Array.from(referrerStats.entries())
      .map(([userId, stats]) => ({
        userId,
        username: stats.username,
        email: stats.email,
        totalReferrals: stats.referrals,
        totalEarnings: stats.earnings,
      }))
      .sort((a, b) => b.totalReferrals - a.totalReferrals)
      .slice(0, 10);

    return {
      totalReferrals,
      activeReferrals,
      totalEarnings,
      pendingEarnings,
      monthlyReferrals,
      topReferrers,
    };
  }, [getReferralHistory]);

  // Обновляем статистику
  useEffect(() => {
    const stats = getGlobalReferralStats();
    setReferralStats(stats);
  }, [getGlobalReferralStats]);

  // Проверяем реферальный код
  const validateReferralCode = useCallback((code: string): boolean => {
    // Простая валидация - код должен быть длиной 8-15 символов и содержать только буквы и цифры
    return /^[A-Z0-9]{8,15}$/.test(code);
  }, []);

  // Получаем пользователя по реферальному коду
  const getUserByReferralCode = useCallback((code: string): User | null => {
    // В реальном приложении это должно быть API-запросом
    // Здесь мы ищем в localStorage
    try {
      const users = localStorage.getItem('secretvoicer_users');
      if (users) {
        const parsedUsers = JSON.parse(users);
        return parsedUsers.find((user: User) => user.referralCode === code) || null;
      }
    } catch (error) {
      console.error('Error finding user by referral code:', error);
    }
    return null;
  }, []);

  return {
    referralProgram,
    referralStats,
    generateReferralCode,
    createReferral,
    activateReferral,
    completeReferral,
    getUserReferralStats,
    getGlobalReferralStats,
    validateReferralCode,
    getUserByReferralCode,
    saveReferralProgram,
  };
};
