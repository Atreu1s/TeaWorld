import { useEffect, useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Проверяем авторизацию СРАЗУ
        if (!authAPI.isLoggedIn()) {
          navigate('/auth', { replace: true });
          return;
        }

        const userData = await authAPI.getCurrentUser();
        
        if (userData) {
          setUser(userData);
        } else {
          authAPI.logout();
          navigate('/auth', { replace: true });
        }
      } catch (err) {
        authAPI.logout();
        navigate('/auth', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/auth', { replace: true });
  };

  // Защита от загрузки и отсутствия пользователя
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Загрузка профиля...</div>
      </div>
    );
  }

  // Если пользователь не загрузился — перенаправляем
  if (!user) {
    navigate('/auth', { replace: true });
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>👤 Мой профиль</h1>
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <span className="field-label"><strong>Имя пользователя:</strong></span>
            {/* 🔑 Защита от null через опциональную цепочку */}
            <span className="field-value">{user?.username || '—'}</span>
          </div>

          <div className="profile-field">
            <span className="field-label"><strong>Email:</strong></span>
            <span className="field-value">{user?.email || '—'}</span>
          </div>

          <div className="profile-field">
            <span className="field-label"><strong>ID пользователя:</strong></span>
            <span className="field-value">{user?.id || '—'}</span>
          </div>

          <div className="profile-field">
            <span className="field-label"><strong>Дата регистрации:</strong></span>
            <span className="field-value">
              {user?.createdAt 
                ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Не указана'}
            </span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            onClick={handleLogout} 
            className="btn-logout"
            aria-label="Выйти из аккаунта"
          >
            Выйти из системы
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;