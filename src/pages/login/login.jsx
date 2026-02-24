import { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './login.scss';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Валидация отдельного поля
  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case 'email':
        if (!value.trim()) error = 'Email обязателен';
        else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = 'Неверный формат email';
        }
        break;
      
      case 'password':
        if (!value) error = 'Пароль обязателен';
        else if (value.length < 8) error = 'Минимум 8 символов';
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

  // Обработчик изменения полей формы
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

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Валидация всех полей
    const isValid = 
      validateField('email', formData.email) &&
      validateField('password', formData.password);

    if (!isValid) {
      setServerError('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setLoading(true);

    try {
      // Вызываем метод логина из API
      await authAPI.login(formData);
      
      // Если логин успешен, перенаправляем на профиль
      navigate('/profile');
    } catch (err) {

      // Обработка ошибок авторизации
      const errorMessage = err.response?.data?.message || 'Ошибка входа';
      
      // Специфическая обработка ошибки неверных данных
      if (errorMessage.includes('Неверный email') || errorMessage.includes('Неверный пароль')) {
        setServerError('Неверный email или пароль');
        // Подсвечиваем оба поля как ошибочные
        setFieldErrors({
          email: 'Проверьте правильность ввода',
          password: 'Проверьте правильность ввода'
        });
      } else {
        console.log('🔍 Устанавливаем serverError:', errorMessage);
        setServerError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 🔴 ОБЩАЯ ОШИБКА СЕРВЕРА (неверный логин/пароль) */}
      {serverError && <div className="alert-danger">{serverError}</div>}
      
      <h1>Вход в систему</h1>
      <form className='auth-form' onSubmit={handleSubmit}>
        
        <div className={`form-group ${fieldErrors.email ? 'has-error' : ''}`}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Введите ваш email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {/* 🔴 ОШИБКА ПОЛЯ EMAIL */}
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
            placeholder="Введите пароль"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
          />
          {/* 🔴 ОШИБКА ПОЛЯ ПАРОЛЯ */}
          {fieldErrors.password && (
            <div id="password-error" className="error-message" role="alert">
              {fieldErrors.password}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={loading ? 'btn-loading' : ''}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
        
      </form>
      <p className='log-reg-link'>
        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
      </p>
    </div>
  );
}