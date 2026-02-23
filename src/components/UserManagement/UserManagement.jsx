// src/components/admin/UserManagement.jsx
import { useEffect, useState, useMemo } from 'react';
import userAPI from '../../services/usersApi';
import UserSearchFilters from './UserSearch/UserSearchFilters';
import './UserManagement.scss';

const UserManagement = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔍 СОСТОЯНИЕ ДЛЯ ПОИСКА И ФИЛЬТРОВ (управляется здесь, передаётся в компонент)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'blocked'

  // Загрузка списка пользователей
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userAPI.getAllUsers();
        setUsers(data.users);
      } catch (err) {
        setError('Не удалось загрузить список пользователей');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  //  ФИЛЬТРАЦИЯ: поиск + статус
  const filteredUsers = useMemo(() => {
    let result = users;

    // 1. Фильтр по статусу
    if (statusFilter === 'active') {
      result = result.filter(user => !user.isBlocked);
    } else if (statusFilter === 'blocked') {
      result = result.filter(user => user.isBlocked);
    }

    // 2. Поиск по полям
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      result = result.filter(user => {
        if (searchField === 'all') {
          return (
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query) ||
            user._id.toLowerCase().includes(query)
          );
        }
        
        if (searchField === 'username') {
          return user.username.toLowerCase().includes(query);
        }
        
        if (searchField === 'email') {
          return user.email.toLowerCase().includes(query);
        }
        
        if (searchField === 'role') {
          return user.role.toLowerCase().includes(query);
        }
        
        if (searchField === 'id') {
          return user._id.toLowerCase().includes(query);
        }

        return false;
      });
    }

    return result;
  }, [users, searchQuery, searchField, statusFilter]);

  // Блокировка/разблокировка пользователя
  const handleToggleBlock = async (userId) => {
    try {
      const result = await userAPI.toggleBlockUser(userId);
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isBlocked: result.user.isBlocked } : user
        )
      );
      
      alert(result.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка при изменении статуса');
    }
  };

  // Очистка всех фильтров
  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchField('all');
    setStatusFilter('all');
  };

  if (loading) {
    return <div className="user-management">Загрузка списка пользователей...</div>;
  }

  if (error) {
    return (
      <div className="user-management error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="user-management">
      <h2>Управление пользователями</h2>
      
      {/* 🔍 КОМПОНЕНТ ПОИСКА И ФИЛЬТРОВ */}
      <UserSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchField={searchField}
        setSearchField={setSearchField}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalUsers={users.length}
        filteredUsersCount={filteredUsers.length}
        onClearFilters={handleClearFilters}
      />
      
      {/* Таблица пользователей */}
      <div className="users-table">
        <div className="users-table-header">
          <div>Логин</div>
          <div>Email</div>
          <div>Роль</div>
          <div>Статус</div>
          <div>Действия</div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="no-results">
            <p>Пользователи не найдены</p>
            {(searchQuery || statusFilter !== 'all') && (
              <button onClick={handleClearFilters} className="btn-clear-search">
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          filteredUsers.map(user => (
            <div 
              key={user._id} 
              className={`user-row ${user.isBlocked ? 'user-blocked' : ''}`}
            >
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>
                <span className={`user-role role-${user.role}`}>
                  {user.role === 'admin' ? 'Администратор' : 
                   user.role === 'expert' ? 'Знаток' : 'Пользователь'}
                </span>
              </div>
              <div>
                <span className={`user-status ${user.isBlocked ? 'status-blocked' : 'status-active'}`}>
                  {user.isBlocked ? 'Заблокирован' : 'Активен'}
                </span>
              </div>
              <div>
                <button 
                  onClick={() => handleToggleBlock(user._id)}
                  className={`block-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                  disabled={user._id === currentUserId}
                  aria-label={user.isBlocked ? `Разблокировать ${user.username}` : `Заблокировать ${user.username}`}
                >
                  {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;