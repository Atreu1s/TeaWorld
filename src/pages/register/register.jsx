import { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Валидация отдельного поля
  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case 'username':
        if (!value.trim()) error = 'Имя пользователя обязательно';
        else if (value.length < 3) error = 'Минимум 3 символа';
        else if (value.length > 30) error = 'Максимум 30 символов';
        else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          error = 'Только буквы, цифры, дефис и подчёркивание';
        }
        break;
      
      case 'email':
        if (!value.trim()) error = 'Email обязателен';
        else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = 'Неверный формат email';
        }
        break;
      
      case 'password':
        if (!value) error = 'Пароль обязателен';
        else if (value.length < 8) error = 'Минимум 8 символов'; // как в схеме БД
        break;
      
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Пароли не совпадают';
        }
        break;
      
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  // Обработка изменений
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Очищаем ошибку для этого поля
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    setServerError('');
  };

  // Валидация при потере фокуса
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Валидация всех полей
    const isValid = 
      validateField('username', formData.username) &&
      validateField('email', formData.email) &&
      validateField('password', formData.password) &&
      validateField('confirmPassword', formData.confirmPassword);

    if (!isValid || formData.password !== formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Пароли не совпадают' }));
      }
      setServerError('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(formData);
      navigate('/profile');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка регистрации';
      
      // Обработка ошибок уникальности
      if (errorMessage.includes('уже существует')) {
        if (errorMessage.includes('email')) {
          setFieldErrors(prev => ({ ...prev, email: 'Этот email уже зарегистрирован' }));
        } else {
          setFieldErrors(prev => ({ ...prev, username: 'Это имя уже занято' }));
        }
      } else {
        setServerError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='body-area'>
      {/* 🔴 ОБЩАЯ ОШИБКА СЕРВЕРА */}
      {serverError && <div className="alert-danger">{serverError}</div>}
      
      <h1>Регистрация</h1>
      <form className='reg-form' onSubmit={handleSubmit}>
        
        <div className={`form-group ${fieldErrors.username ? 'has-error' : ''}`}>
          <label>Имя пользователя</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!fieldErrors.username}
            aria-describedby={fieldErrors.username ? "username-error" : undefined}
          />
          {/* 🔴 ОШИБКА ПОЛЯ */}
          {fieldErrors.username && (
            <div id="username-error" className="error-message" role="alert">
              {fieldErrors.username}
            </div>
          )}
        </div>

        <div className={`form-group ${fieldErrors.email ? 'has-error' : ''}`}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <div id="email-error" className="error-message" role="alert">
              {fieldErrors.email}
            </div>
          )}
        </div>

        <div className={`form-group ${fieldErrors.password ? 'has-error' : ''}`}>
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
          />
          {fieldErrors.password && (
            <div id="password-error" className="error-message" role="alert">
              {fieldErrors.password}
            </div>
          )}
          {/* 💡 ПОДСКАЗКА */}
          <div className="hint-text">
            Минимум 8 символов
          </div>
        </div>

        <div className={`form-group ${fieldErrors.confirmPassword ? 'has-error' : ''}`}>
          <label>Подтвердите пароль</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!fieldErrors.confirmPassword}
            aria-describedby={fieldErrors.confirmPassword ? "confirm-error" : undefined}
          />
          {fieldErrors.confirmPassword && (
            <div id="confirm-error" className="error-message" role="alert">
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>

        <div className="form-button-container">
          <button type="submit" disabled={loading} className={loading ? 'btn-loading' : ''}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </div>
        
      </form>
      <p className='log-reg-link'>
        Уже есть аккаунт? <a href="/auth">Войти</a>
      </p>
      
    </section>
  );
}

export default Register;