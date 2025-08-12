import { useState, useEffect, useCallback } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

const AUTH_STORAGE_KEY = 'secretvoicer_auth';
const TOKEN_STORAGE_KEY = 'secretvoicer_token';

// Простая база данных пользователей в localStorage (для демо)
const USERS_STORAGE_KEY = 'secretvoicer_users';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Загружаем состояние авторизации при инициализации
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    
    if (token && savedAuth) {
      try {
        const user = JSON.parse(savedAuth);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error loading auth state:', error);
        // Очищаем поврежденные данные
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Инициализируем базу пользователей
  // Демо-аккаунты удалены для продакшена
  
  // Очищаем демо-аккаунты из localStorage если они есть
  useEffect(() => {
    const clearDemoAccounts = () => {
      try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        if (users) {
          const parsedUsers = JSON.parse(users);
          const filteredUsers = parsedUsers.filter((user: any) => 
            user.email !== 'demo@secretvoicer.com' && 
            user.email !== 'admin@secretvoicer.com'
          );
          if (filteredUsers.length !== parsedUsers.length) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
            console.log('Demo accounts removed from localStorage');
          }
        }
      } catch (error) {
        console.error('Error clearing demo accounts:', error);
      }
    };
    
    clearDemoAccounts();
  }, []);

  const saveAuthState = useCallback((user: User, token: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }, []);

  const clearAuthState = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const getUsers = useCallback((): any[] => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }, []);

  const saveUsers = useCallback((users: any[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, []);

  // Временное создание админа для тестирования - удалить после первого входа!
  useEffect(() => {
    const users = getUsers();
    const adminExists = users.find(u => u.isAdmin);
    
    if (!adminExists) {
      const adminUser = {
        id: 'admin_' + Date.now(),
        email: 'admin@voxyza.com',
        username: 'Admin',
        password: 'admin123',
        isAdmin: true,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        subscription: { type: 'pro' as const },
        settings: { defaultLanguage: 'ru-RU' },
        // Реферальная система
        referralCode: 'ADMIN' + Date.now().toString(36).substr(2, 5).toUpperCase(),
        referralStats: {
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
        },
        referralHistory: [],
      };
      
      users.push(adminUser);
      saveUsers(users);
      console.log('Admin user created:', adminUser.email, adminUser.password);
    }
  }, [getUsers, saveUsers]);

  // Генерируем уникальный реферальный код
  const generateReferralCode = useCallback((userId: string, username: string): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const usernamePart = username.toLowerCase().replace(/[^a-z0-9]/g, '').substr(0, 3);
    return `${usernamePart}${timestamp}${random}`.toUpperCase();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const users = getUsers();
      
      const user = users.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() && 
        u.password === credentials.password
      );

      if (!user) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Неверный email или пароль',
        }));
        return false;
      }

      // Обновляем время последнего входа
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, lastLoginAt: Date.now() }
          : u
      );
      saveUsers(updatedUsers);

      const { password, ...userWithoutPassword } = user;
      const token = `token_${user.id}_${Date.now()}`;
      
      saveAuthState(userWithoutPassword, token);
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Ошибка входа в систему',
      }));
      return false;
    }
  }, [getUsers, saveUsers, saveAuthState]);

  const register = useCallback(async (credentials: RegisterCredentials & { referralCode?: string }): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (credentials.password !== credentials.confirmPassword) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Пароли не совпадают',
        }));
        return false;
      }

      if (credentials.password.length < 6) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Пароль должен содержать минимум 6 символов',
        }));
        return false;
      }

      const users = getUsers();
      
      // Проверяем, что email и username уникальны
      const existingUser = users.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() ||
        u.username.toLowerCase() === credentials.username.toLowerCase()
      );

      if (existingUser) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Пользователь с таким email или именем уже существует',
        }));
        return false;
      }

      // Обрабатываем реферальный код
      let referredBy: string | undefined;
      if (credentials.referralCode) {
        const referrer = users.find(u => u.referralCode === credentials.referralCode);
        if (referrer) {
          referredBy = referrer.id;
          console.log(`User registered with referral code from: ${referrer.username}`);
        }
      }

      // Создаем нового пользователя
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: credentials.email,
        username: credentials.username,
        password: credentials.password, // В реальном приложении - хеш
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        subscription: { type: 'free' as const },
        settings: {
          defaultLanguage: 'ru-RU',
          useBark: false,
        },
        // Реферальная система
        referralCode: generateReferralCode(`user_${Date.now()}`, credentials.username),
        referredBy,
        referralStats: {
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
        },
        referralHistory: [],
      };

      users.push(newUser);
      saveUsers(users);

      // Если пользователь зарегистрировался по реферальному коду, обновляем статистику реферера
      if (referredBy) {
        const referrer = users.find(u => u.id === referredBy);
        if (referrer) {
          referrer.referralStats = referrer.referralStats || {
            totalReferrals: 0,
            activeReferrals: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
          };
          referrer.referralStats.totalReferrals += 1;
          referrer.referralStats.pendingEarnings += 100; // Бонус за реферала
          saveUsers(users);
        }
      }

      const { password, ...userWithoutPassword } = newUser;
      const token = `token_${newUser.id}_${Date.now()}`;
      
      saveAuthState(userWithoutPassword, token);
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Ошибка регистрации',
      }));
      return false;
    }
  }, [getUsers, saveUsers, saveAuthState, generateReferralCode]);

  const logout = useCallback(() => {
    clearAuthState();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, [clearAuthState]);

  const updateUserSettings = useCallback((settings: Partial<User['settings']>) => {
    if (!authState.user) return;

    const updatedUser = {
      ...authState.user,
      settings: {
        ...authState.user.settings,
        ...settings,
      },
    };

    // Обновляем в localStorage
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id 
        ? { ...u, settings: updatedUser.settings }
        : u
    );
    saveUsers(updatedUsers);

    // Обновляем состояние
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      saveAuthState(updatedUser, token);
    }

    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  }, [authState.user, getUsers, saveUsers, saveAuthState]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateUserSettings,
    generateReferralCode,
  };
}; 