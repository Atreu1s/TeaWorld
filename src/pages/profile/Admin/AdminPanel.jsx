// src/components/admin/AdminPanel.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { userAPI } from '../../services/userApi';
import './AdminPanel.scss';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Проверка прав администратора при монтировании
  useEffect(() => {
    if (!authAPI.isLoggedIn()) {
      navigate('/auth');
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.role !== 'admin') {
      navigate('/profile');
      return;
    }
    
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
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

  const handleToggleBlock = async (userId) => {
    try {
      const result = await userAPI.toggleBlockUser(userId);
      
      // Обновляем локальный стейт без полной перезагрузки
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
    return <div className="admin-panel">Загрузка списка пользователей...</div>;
  }

  if (error) {
    return (
      <div className="admin-panel error">
        <p>{error}</p>
        <button onClick={fetchUsers}>Повторить попытку</button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>👥 Администрирование пользователей</h1>
      
      <div className="users-list">
        {users.map(user => (
          <div 
            key={user._id} 
            className={`user-card ${user.isBlocked ? 'blocked' : ''}`}
          >
            <div className="user-info">
              <strong>{user.username}</strong>
              <span className="user-email">{user.email}</span>
              <span className={`user-role role-${user.role}`}>
                {user.role === 'admin' ? 'Администратор' : 
                 user.role === 'expert' ? 'Знаток' : 'Пользователь'}
              </span>
              {user.isBlocked && (
                <span className="user-status blocked-status">❌ Заблокирован</span>
              )}
            </div>
            
            <button 
              onClick={() => handleToggleBlock(user._id)}
              className={`block-btn ${user.isBlocked ? 'unblock' : 'block'}`}
              aria-label={user.isBlocked ? `Разблокировать ${user.username}` : `Заблокировать ${user.username}`}
            >
              {user.isBlocked ? '🔓 Разблокировать' : '🔒 Заблокировать'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;