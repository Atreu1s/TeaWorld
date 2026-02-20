// src/components/admin/UserManagement.jsx
import { useEffect, useState } from 'react';
import userAPI from '../../services/usersApi';
import './UserManagement.scss';

const UserManagement = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Блокировка/разблокировка пользователя
  const handleToggleBlock = async (userId) => {
    try {
      const result = await userAPI.toggleBlockUser(userId);
      
      // Обновляем локальный стейт
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
      <h2>👥 Управление пользователями</h2>
      
      <div className="users-table">
        <div className="users-table-header">
          <div>Имя пользователя</div>
          <div>Email</div>
          <div>Роль</div>
          <div>Статус</div>
          <div>Действия</div>
        </div>
        
        {users.map(user => (
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
                {user.isBlocked ? '❌ Заблокирован' : '✅ Активен'}
              </span>
            </div>
            <div>
              <button 
                onClick={() => handleToggleBlock(user._id)}
                className={`block-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                disabled={user._id === currentUserId} // Нельзя заблокировать себя
                aria-label={user.isBlocked ? `Разблокировать ${user.username}` : `Заблокировать ${user.username}`}
              >
                {user.isBlocked ? '🔓 Разблокировать' : '🔒 Заблокировать'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;