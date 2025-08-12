import { useState, useEffect, useCallback } from 'react';
import { AdminStats, AdminUser, AdminFilters, SubscriptionPlan, AdminAction } from '../types/admin';
import { User } from '../types/auth';

const USERS_STORAGE_KEY = 'secretvoicer_users';
const HISTORY_STORAGE_KEY = 'secretvoicer_history';
const ADMIN_ACTIONS_STORAGE_KEY = 'secretvoicer_admin_actions';

export const useAdmin = (currentUser: User | null) => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalVoiceovers: 0,
    todayVoiceovers: 0,
    barkUsage: 0,
    elevenlabsUsage: 0,
    browserUsage: 0,
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filters, setFilters] = useState<AdminFilters>({ search: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем права администратора
  const isAdmin = currentUser?.isAdmin;

  // Загружаем данные
  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Загружаем пользователей
      const usersData = localStorage.getItem(USERS_STORAGE_KEY);
      const allUsers: AdminUser[] = usersData ? JSON.parse(usersData) : [];

      // Загружаем историю для подсчета статистики
      const historyData = localStorage.getItem(HISTORY_STORAGE_KEY);
      const allHistory = historyData ? JSON.parse(historyData) : [];

      // Подсчитываем статистику
      const today = new Date().toDateString();
      const todayHistory = allHistory.filter((item: any) => 
        new Date(item.timestamp).toDateString() === today
      );

      const newStats: AdminStats = {
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(u => !u.isBlocked).length,
        premiumUsers: allUsers.filter(u => u.subscription?.type !== 'free').length,
        totalVoiceovers: allHistory.length,
        todayVoiceovers: todayHistory.length,
        barkUsage: allHistory.filter((item: any) => item.useBark).length,
        elevenlabsUsage: allHistory.filter((item: any) => item.useElevenLabs).length,
        browserUsage: allHistory.filter((item: any) => !item.useBark && !item.useElevenLabs).length,
      };

      // Добавляем статистику к пользователям
      const usersWithStats = allUsers.map(user => {
        const userHistory = allHistory.filter((item: any) => item.userId === user.id);
        return {
          ...user,
          voiceoverCount: userHistory.length,
          lastActivity: userHistory.length > 0 
            ? Math.max(...userHistory.map((item: any) => item.timestamp))
            : user.lastLoginAt,
        };
      });

      setStats(newStats);
      setUsers(usersWithStats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Фильтруем пользователей
  const filteredUsers = users.filter(user => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!user.username.toLowerCase().includes(searchLower) && 
          !user.email.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    if (filters.subscriptionType && filters.subscriptionType !== 'all') {
      if (user.subscription?.type !== filters.subscriptionType) {
        return false;
      }
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'blocked' && !user.isBlocked) return false;
      if (filters.status === 'active' && user.isBlocked) return false;
    }

    if (filters.dateFrom && user.createdAt < filters.dateFrom.getTime()) {
      return false;
    }

    if (filters.dateTo && user.createdAt > filters.dateTo.getTime()) {
      return false;
    }

    return true;
  });

  // Блокировка/разблокировка пользователя
  const toggleUserBlock = useCallback(async (userId: string, block: boolean) => {
    if (!isAdmin || !currentUser) return false;

    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, isBlocked: block } : user
      );

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      // Записываем действие администратора
      const action: AdminAction = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        action: block ? 'block' : 'unblock',
        details: { reason: 'Admin action' },
        timestamp: Date.now(),
        adminId: currentUser.id,
      };

      const existingActions = localStorage.getItem(ADMIN_ACTIONS_STORAGE_KEY);
      const actions = existingActions ? JSON.parse(existingActions) : [];
      actions.push(action);
      localStorage.setItem(ADMIN_ACTIONS_STORAGE_KEY, JSON.stringify(actions));

      return true;
    } catch (error) {
      console.error('Error toggling user block:', error);
      return false;
    }
  }, [users, isAdmin, currentUser]);

  // Изменение подписки пользователя
  const changeUserSubscription = useCallback(async (userId: string, subscriptionType: 'free' | 'premium' | 'pro') => {
    if (!isAdmin || !currentUser) return false;

    try {
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              subscription: { 
                type: subscriptionType,
                expiresAt: subscriptionType === 'free' ? undefined : Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 дней
              }
            } 
          : user
      );

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      // Записываем действие администратора
      const action: AdminAction = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        action: 'change_subscription',
        details: { newType: subscriptionType },
        timestamp: Date.now(),
        adminId: currentUser.id,
      };

      const existingActions = localStorage.getItem(ADMIN_ACTIONS_STORAGE_KEY);
      const actions = existingActions ? JSON.parse(existingActions) : [];
      actions.push(action);
      localStorage.setItem(ADMIN_ACTIONS_STORAGE_KEY, JSON.stringify(actions));

      return true;
    } catch (error) {
      console.error('Error changing user subscription:', error);
      return false;
    }
  }, [users, isAdmin, currentUser]);

  // Удаление пользователя
  const deleteUser = useCallback(async (userId: string) => {
    if (!isAdmin || !currentUser) return false;

    try {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      // Записываем действие администратора
      const action: AdminAction = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        action: 'delete_user',
        details: { reason: 'Admin deletion' },
        timestamp: Date.now(),
        adminId: currentUser.id,
      };

      const existingActions = localStorage.getItem(ADMIN_ACTIONS_STORAGE_KEY);
      const actions = existingActions ? JSON.parse(existingActions) : [];
      actions.push(action);
      localStorage.setItem(ADMIN_ACTIONS_STORAGE_KEY, JSON.stringify(actions));

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }, [users, isAdmin, currentUser]);

  // Получение действий администратора
  const getAdminActions = useCallback(() => {
    try {
      const actionsData = localStorage.getItem(ADMIN_ACTIONS_STORAGE_KEY);
      return actionsData ? JSON.parse(actionsData) : [];
    } catch (error) {
      console.error('Error loading admin actions:', error);
      return [];
    }
  }, []);

  return {
    isAdmin,
    stats,
    users: filteredUsers,
    filters,
    setFilters,
    isLoading,
    toggleUserBlock,
    changeUserSubscription,
    deleteUser,
    getAdminActions,
    refreshData: loadData,
  };
}; 