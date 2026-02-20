import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../../services/blogApi';
import './FullPostView.scss';

const FullPostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogAPI.getPostById(id);
        setPost(data);
      } catch (err) {
        setError('Не удалось загрузить пост. Возможно, он был удалён.');
        console.error('Ошибка загрузки поста:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="post-loading">Загрузка поста...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container error">
        <div className="error-card">
          <h2>Пост не найден</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              Назад
            </button>
            <Link to="/blog" className="btn-primary">
              К списку постов
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="body-area">
      <div className="post-area">
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <span className="post-author">Автор: {post.authorName}</span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags-detail">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="tag tag-detail">#{tag}</span>
            ))}
          </div>
        )}
        
        <div>
          <p>{post.content}</p>
        </div>
        
        <div className="post-detail-actions">
          <button onClick={() => navigate(-1)} className="GoBackBtn">
            Назад
          </button>
          <Link to="/blog" className="GoBlogBtn">
            К списку постов
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FullPostView;