import { useState } from 'react';
import { AdminUser, AdminFilters } from '../types/admin';

interface AdminUsersProps {
  users: AdminUser[];
  filters: AdminFilters;
  onFiltersChange: (filters: AdminFilters) => void;
  onToggleBlock: (userId: string, block: boolean) => Promise<boolean>;
  onChangeSubscription: (userId: string, type: 'free' | 'premium' | 'pro') => Promise<boolean>;
  onDeleteUser: (userId: string) => Promise<boolean>;
  isLoading: boolean;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  filters,
  onFiltersChange,
  onToggleBlock,
  onChangeSubscription,
  onDeleteUser,
  isLoading,
}) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubscriptionBadge = (type?: string) => {
    switch (type) {
      case 'premium':
        return <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full">Premium</span>;
      case 'pro':
        return <span className="px-2 py-1 bg-purple-600 text-purple-100 text-xs rounded-full">Pro</span>;
      default:
        return <span className="px-2 py-1 bg-gray-600 text-gray-100 text-xs rounded-full">Free</span>;
    }
  };

  const getStatusBadge = (user: AdminUser) => {
    if (user.isBlocked) {
      return <span className="px-2 py-1 bg-red-600 text-red-100 text-xs rounded-full">Заблокирован</span>;
    }
    if (user.isAdmin) {
      return <span className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full">Админ</span>;
    }
    return <span className="px-2 py-1 bg-green-600 text-green-100 text-xs rounded-full">Активен</span>;
  };

  const handleToggleBlock = async (user: AdminUser) => {
    const success = await onToggleBlock(user.id, !user.isBlocked);
    if (success) {
      setShowActions(null);
    }
  };

  const handleChangeSubscription = async (user: AdminUser, newType: 'free' | 'premium' | 'pro') => {
    const success = await onChangeSubscription(user.id, newType);
    if (success) {
      setShowActions(null);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
      const success = await onDeleteUser(user.id);
      if (success) {
        setShowActions(null);
      }
    }
  };

  return (
    <div className="bg-dark-card border border-gray-600 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-text">Управление пользователями</h2>
        <span className="text-gray-400">Всего: {users.length}</span>
      </div>

      {/* Фильтры */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 focus:outline-none focus:border-accent-yellow"
          />
          <select
            value={filters.subscriptionType || 'all'}
            onChange={(e) => onFiltersChange({ ...filters, subscriptionType: e.target.value as any })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
          >
            <option value="all">Все подписки</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="pro">Pro</option>
          </select>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-dark-text focus:outline-none focus:border-accent-yellow"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="blocked">Заблокированные</option>
          </select>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Пользователь</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Подписка</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Статус</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Озвучки</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Последняя активность</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-yellow mx-auto"></div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-dark-text">{user.username}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getSubscriptionBadge(user.subscription?.type)}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(user)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-dark-text">{user.voiceoverCount || 0}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-400">
                      {user.lastActivity ? formatDate(user.lastActivity) : 'Никогда'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                        className="p-2 text-gray-400 hover:text-dark-text transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {showActions === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleToggleBlock(user)}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text hover:bg-gray-700"
                            >
                              {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                            </button>
                            <div className="border-t border-gray-600 my-1"></div>
                            <button
                              onClick={() => handleChangeSubscription(user, 'free')}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text hover:bg-gray-700"
                            >
                              Установить Free
                            </button>
                            <button
                              onClick={() => handleChangeSubscription(user, 'premium')}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text hover:bg-gray-700"
                            >
                              Установить Premium
                            </button>
                            <button
                              onClick={() => handleChangeSubscription(user, 'pro')}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text hover:bg-gray-700"
                            >
                              Установить Pro
                            </button>
                            <div className="border-t border-gray-600 my-1"></div>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            >
                              Удалить пользователя
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 