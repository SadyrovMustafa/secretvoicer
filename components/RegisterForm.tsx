import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RegisterCredentials } from '../types/auth';

interface RegisterFormProps {
  onRegister: (credentials: RegisterCredentials & { referralCode?: string }) => Promise<boolean>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  isLoading,
  error,
}) => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<RegisterCredentials & { referralCode?: string }>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  // Автоматически заполняем реферальный код из URL
  useEffect(() => {
    const { ref } = router.query;
    if (ref && typeof ref === 'string') {
      setCredentials(prev => ({
        ...prev,
        referralCode: ref.toUpperCase(),
      }));
    }
  }, [router.query]);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (credentials.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    if (credentials.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать минимум 3 символа';
    }

    if (!credentials.email.includes('@')) {
      errors.email = 'Введите корректный email';
    }

    // Валидация реферального кода (опционально)
    if (credentials.referralCode && credentials.referralCode.trim()) {
      if (!/^[A-Z0-9]{8,15}$/.test(credentials.referralCode.trim().toUpperCase())) {
        errors.referralCode = 'Неверный формат реферального кода';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Очищаем пустой реферальный код
      const cleanCredentials = {
        ...credentials,
        referralCode: credentials.referralCode?.trim() || undefined,
      };
      await onRegister(cleanCredentials);
    }
  };

  const handleChange = (field: keyof (RegisterCredentials & { referralCode?: string })) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    
    // Автоматически приводим реферальный код к верхнему регистру
    if (field === 'referralCode') {
      value = value.toUpperCase();
    }
    
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Очищаем ошибку валидации при изменении поля
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors[field] || '';
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-dark-card border border-gray-600 rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text mb-2">Secret Voicer</h1>
            <p className="text-dark-text-secondary">Создайте новый аккаунт</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={handleChange('email')}
                required
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow ${
                  getFieldError('email') ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Введите ваш email"
              />
              {getFieldError('email') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-text mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={handleChange('username')}
                required
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow ${
                  getFieldError('username') ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Введите имя пользователя"
              />
              {getFieldError('username') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('username')}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={handleChange('password')}
                required
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow ${
                  getFieldError('password') ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Введите пароль (минимум 6 символов)"
              />
              {getFieldError('password') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('password')}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text mb-2">
                Подтвердите пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow ${
                  getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Повторите пароль"
              />
              {getFieldError('confirmPassword') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('confirmPassword')}</p>
              )}
            </div>

            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-dark-text mb-2">
                Реферальный код <span className="text-gray-400 text-xs">(необязательно)</span>
              </label>
              <input
                type="text"
                id="referralCode"
                value={credentials.referralCode}
                onChange={handleChange('referralCode')}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow ${
                  getFieldError('referralCode') ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Введите реферальный код"
                maxLength={15}
              />
              {getFieldError('referralCode') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('referralCode')}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">
                Получите бонусы за регистрацию по реферальному коду
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-yellow text-black font-semibold py-3 px-4 rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-text-secondary">
              Уже есть аккаунт?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-accent-yellow hover:text-yellow-400 transition-colors"
              >
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 