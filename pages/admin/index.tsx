import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminStatsComponent } from '../../components/AdminStats';
import { AdminUsers } from '../../components/AdminUsers';
import { AdminReferrals } from '../../components/AdminReferrals';
import { User } from '../../types/auth';

const AdminLoginForm = ({ onLogin }: { onLogin: (email: string, password: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onLogin(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Secret Voicer</h1>
          <h2 className="text-xl text-gray-300 mt-2">Админ панель</h2>
          <p className="text-gray-400 mt-2">Войдите в админ панель</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="admin123"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Вход...' : 'Войти в админку'}
          </button>
        </form>
        
                  <div className="text-center text-sm text-gray-400">
            <p>Для доступа к админ панели нужны права администратора</p>
          </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'referrals'>('stats');
  const { stats, users, filters, setFilters, toggleUserBlock, changeUserSubscription, deleteUser, isLoading } = useAdmin(user);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Админ панель</h1>
          <p className="text-gray-400 mt-2">Управление пользователями и статистика</p>
        </div>

        {/* Табы */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Статистика
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Пользователи
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'referrals'
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Рефералы
            </button>
          </nav>
        </div>

        {/* Контент */}
        {activeTab === 'stats' && <AdminStatsComponent stats={stats} />}
        {activeTab === 'users' && (
          <AdminUsers
            users={users}
            filters={filters}
            onFiltersChange={setFilters}
            onToggleBlock={toggleUserBlock}
            onChangeSubscription={changeUserSubscription}
            onDelete={deleteUser}
            isLoading={isLoading}
          />
        )}
        {activeTab === 'referrals' && <AdminReferrals user={user} />}
      </div>
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, error } = useAuth();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Проверяем, является ли пользователь админом
  useEffect(() => {
            if (isAuthenticated && user && user.isAdmin) {
      setIsAdminAuthenticated(true);
    }
  }, [isAuthenticated, user]);

  const handleAdminLogin = async (email: string, password: string) => {
    const success = await login({ email, password });
    if (success) {
      const currentUser = JSON.parse(localStorage.getItem('secretvoicer_auth') || '{}');
              if (currentUser.isAdmin) {
        setIsAdminAuthenticated(true);
      } else {
        alert('Доступ запрещен. Требуются права администратора.');
        router.push('/');
      }
    }
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-white mt-4">Загрузка админки...</p>
        </div>
      </div>
    );
  }

  // Если не админ, показываем форму входа
  if (!isAdminAuthenticated) {
    return <AdminLoginForm onLogin={handleAdminLogin} />;
  }

  // Если админ, показываем панель
  return user ? <AdminPanel user={user} /> : null;
} 