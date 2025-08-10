import { useState } from 'react';
import { LoginCredentials } from '../types/auth';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  onSwitchToRegister: () => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSwitchToRegister,
  isLoading,
  error,
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(credentials);
  };

  const handleChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-dark-card border border-gray-600 rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text mb-2">Secret Voicer</h1>
            <p className="text-dark-text-secondary">Войдите в свой аккаунт</p>
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow"
                placeholder="Введите ваш email"
              />
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow"
                placeholder="Введите ваш пароль"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-yellow text-black font-semibold py-3 px-4 rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-text-secondary">
              Нет аккаунта?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-accent-yellow hover:text-yellow-400 transition-colors"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>


        </div>
      </div>
    </div>
  );
}; 