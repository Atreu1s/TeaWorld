import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { blogAPI } from '../../services/blogApi'; 
import './Profile.scss';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tags: ''
  });
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

  const handlePostFormChange = (e) => {
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const tagsArray = postForm.tags
        .split(/[, ]+/)
        .filter(tag => tag.trim() !== '')
        .map(tag => tag.trim());

      await blogAPI.createPost({
        title: postForm.title,
        content: postForm.content,
        tags: tagsArray
      });

      setPostForm({ title: '', content: '', tags: '' });
      setShowPostForm(false);

     
      const postsData = await blogAPI.getMyPosts();
      setMyPosts(postsData.posts);

      alert('Пост успешно создан!');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Ошибка создания поста');
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
            <span className="field-value"><strong>{user?.role === 'admin' ? 'Администратор' : 
             user?.role === 'expert' ? 'Знаток' : 'Пользователь'}</strong></span>
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
            <strong><span className="field-value">
              {user?.createdAt 
                ? new Date(user.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    //hour: '2-digit',
                    //minute: '2-digit'
                  })
                : 'Не указана'}
            </span></strong>
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

        {(user?.role === 'expert' || user?.role === 'admin') && (
          <div className="profile-section">
            <h2>Создать пост</h2>
            
            {showPostForm ? (
              <form onSubmit={handleCreatePost} className="post-form">
                <div className="form-group">
                  <label>Заголовок</label>
                  <input
                    type="text"
                    name="title"
                    value={postForm.title}
                    onChange={handlePostFormChange}
                    required
                    placeholder="Введите заголовок поста"
                    maxLength="100"
                  />
                </div>

                <div className="form-group">
                  <label>Текст поста</label>
                  <textarea
                    name="content"
                    value={postForm.content}
                    onChange={handlePostFormChange}
                    required
                    placeholder="Введите текст поста..."
                    rows="8"
                    minLength="10"
                  />
                </div>

                <div className="form-group">
                  <label>Теги (через запятую)</label>
                  <input
                    type="text"
                    name="tags"
                    value={postForm.tags}
                    onChange={handlePostFormChange}
                    placeholder="#чай, #рецепты, #здоровье"
                    maxLength="200"
                  />
                  <small className="form-hint">Максимум 10 тегов</small>
                </div>

                {formError && <div className="alert-danger">{formError}</div>}

                <div className="form-buttons">
                  <button type="submit" disabled={formLoading} className="btn-primary">
                    {formLoading ? 'Создание...' : 'Опубликовать пост'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowPostForm(false)}
                    className="btn-secondary"
                  >
                    Отмена
                  </button>
                </div>
              </form>
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

        {/* ========== МОИ ПОСТЫ (для экспертов и админов) ========== */}
        {(user?.role === 'expert' || user?.role === 'admin') && myPosts.length > 0 && (
          <div className="profile-section">
            <h2>Мои посты</h2>
            
            <div className="posts-list">
              {myPosts.map(post => (
                <div key={post._id} className="post-card">
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  
                  <div className="post-content">
                    <p>{post.content.substring(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
                  </div>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="post-footer">
                    <span className="post-author">Автор: {post.authorName}</span>
                    
                    {(user.role === 'admin' || post.author.toString() === user.id) && (
                      <div className="post-actions">
                        <button 
                          onClick={() => handleDeletePost(post._id)} 
                          className="btn-delete"
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Profile;