import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import blogAPI from '../../services/blogApi'; 
import CreatePost from './CreatePost/CreatePost';
import PostGeneration from './Posts/PostGenerate';
import UserManagement from '../../components/UserManagement/UserManagement';
import './Profile.scss';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authAPI.isLoggedIn()) {
          navigate('/auth');
          return;
        }

        const userData = await authAPI.getCurrentUser();
        if (userData) {
          setUser(userData);

          if (userData.role === 'expert' || userData.role === 'admin') {
            const postsData = await blogAPI.getMyPosts();
            setMyPosts(postsData.posts);
          }
        } else {
          authAPI.logout();
          navigate('/auth');
        }
      } catch (err) {
        setError('Не удалось загрузить профиль. Пожалуйста, войдите снова.');
        authAPI.logout();
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const handleCreatePost = async (postData) => {
    console.log('Данные для отправки:', postData);
    
    setFormError('');
    setFormLoading(true);

    try {
      await blogAPI.createPost(postData);

      setShowPostForm(false);
      
      const postsData = await blogAPI.getMyPosts();
      setMyPosts(postsData.posts);

      alert('Пост успешно создан!');
    } catch (err) {
      console.error('Ошибка создания поста:', err);
      console.error('Статус:', err.response?.status);
      console.error('Данные ошибки:', err.response?.data);
      
      setFormError(
        err.response?.data?.message || 
        'Ошибка создания поста. Проверьте данные и попробуйте снова.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return;
    }

    try {
      await blogAPI.deletePost(postId);
      
      const postsData = await blogAPI.getMyPosts();
      setMyPosts(postsData.posts);
      
      alert('Пост успешно удалён!');
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка удаления поста');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/auth')} className="btn-primary">
          Перейти к входу
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Профиль</h1>
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <span className="field-label">Имя пользователя:</span>
            <span className="field-value"><strong>{user?.username || '—'}</strong></span>
          </div>

          <div className="profile-field">
            <span className="field-label">Роль:</span>
            <span className="field-value">
              <strong>
                {user?.role === 'admin' ? 'Администратор' : 
                 user?.role === 'expert' ? 'Знаток' : 'Пользователь'}
              </strong>
            </span>
          </div>

          <div className="profile-field">
            <span className="field-label">Email:</span>
            <span className="field-value"><strong>{user?.email || '—'}</strong></span>
          </div>

          <div className="profile-field">
            <span className="field-label">ID пользователя:</span>
            <span className="field-value"><strong>{user?.id || '—'}</strong></span>
          </div>

          <div className="profile-field">
            <span className="field-label">Дата регистрации:</span>
            <strong>
              <span className="field-value">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Не указана'}
              </span>
            </strong>
          </div>
          
          <div className="profile-actions">
            <button 
              onClick={handleLogout} 
              className="btn-logout"
              aria-label="Выйти из аккаунта"
            >
              Выйти
            </button>
          </div>
        </div>

        {user?.role === 'admin' && (
          <UserManagement currentUserId={user.id} />
        )}


        {(user?.role === 'expert' || user?.role === 'admin') && (
          <div className="profile-section">
            <h2>Создать пост</h2>
            
            {showPostForm ? (
              <CreatePost 
                onSubmit={handleCreatePost}   
                onCancel={() => setShowPostForm(false)}
                isLoading={formLoading}
                error={formError}
              />
            ) : (
              <button 
                onClick={() => setShowPostForm(true)} 
                className="AddPost"
              >
                Добавить пост
              </button>
            )}
          </div>
        )}

        {(user?.role === 'expert' || user?.role === 'admin') && (
        <PostGeneration 
          posts={myPosts} 
          onDelete={handleDeletePost} 
          userRole={user?.role} 
          currentUserId={user?.id} 
        />
      )}

      </div>
    </div>
  );
};

export default Profile;