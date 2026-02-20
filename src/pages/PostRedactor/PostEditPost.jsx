import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogAPI } from '../../services/blogApi';
import './PostEditPost.scss';

const BlogEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await blogAPI.getPostById(id);
        setFormData({
          title: post.title,
          content: post.content,
          tags: post.tags?.join(', ') || ''
        });
      } catch (err) {
        setError('Не удалось загрузить пост для редактирования');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(/[, ]+/)
        .filter(tag => tag.trim() !== '')
        .map(tag => tag.trim())
        .slice(0, 10);

      await blogAPI.updatePost(id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: tagsArray
      });

      alert('Пост успешно обновлён!');
      navigate(`/profile`); 
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении поста');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="edit-container"><div className="loading">Загрузка поста...</div></div>;
  }

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h1>Редактировать</h1>
        
        {error && <div className="alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} className="editForm">
          <div className="form-group">
            <label>Заголовок</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength="100"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Текст поста</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="12"
              minLength="10"
            />
          </div>

          <div className="form-group">
            <label>Теги (через запятую)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="чай, рецепты, здоровье"
              maxLength="200"
            />
            <small className="form-hint">Максимум 10 тегов</small>
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              disabled={submitting}
              className="btn-save"
            >
              {submitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <Link to={`/profile`} className="CanselChangesBtn">
              Отменить изменения
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditPost;