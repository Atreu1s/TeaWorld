import { useState } from 'react';
import './CreatePost.scss';

const CreatePost = ({ onSubmit, onCancel, isLoading = false, error = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    const trimmedTitle = formData.title.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedTitle) {
      errors.title = 'Заголовок обязателен';
      isValid = false;
    } else if (trimmedTitle.length < 3) {
      errors.title = 'Заголовок должен содержать минимум 3 символа';
      isValid = false;
    }

    if (!trimmedContent) {
      errors.content = 'Текст поста обязателен';
      isValid = false;
    } else if (trimmedContent.length < 10) {
      errors.content = 'Текст поста должен содержать минимум 10 символов';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      }
      return;
    }

    const tagsArray = formData.tags
      .split(/[, ]+/)
      .filter(tag => tag.trim() !== '')
      .map(tag => tag.trim())
      .slice(0, 10); 

    onSubmit({
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: tagsArray 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="postForm">
      <div className={`form-group ${fieldErrors.title ? 'has-error' : ''}`}>
        <label>Заголовок</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Введите заголовок поста"
          maxLength="100"
          autoFocus
          autoComplete="off" 
        />
        {fieldErrors.title && (
          <div className="error-message" role="alert">
            {fieldErrors.title}
          </div>
        )}
      </div>

      <div className={`form-group ${fieldErrors.content ? 'has-error' : ''}`}>
        <label>Текст поста</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          placeholder="Введите текст поста..."
          rows="8"
          minLength="10"
          autoComplete="off"
        />
        {fieldErrors.content && (
          <div className="error-message" role="alert">
            {fieldErrors.content}
          </div>
        )}
      </div>

      <div className={`form-group ${fieldErrors.tags ? 'has-error' : ''}`}>
        <label>Теги (через запятую)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="чай, рецепты, здоровье"
          maxLength="200"
          autoComplete="off" 
        />
        <small className="form-hint">Максимум 10 тегов</small>
      </div>

      {error && <div className="alert-danger">{error}</div>}

      <div className="form-buttons">
        <button type="submit" disabled={isLoading} className="PostCreateBtn">
          {isLoading ? 'Создание...' : 'Опубликовать пост'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default CreatePost;