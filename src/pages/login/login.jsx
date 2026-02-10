import { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './login.scss';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Вызываем метод логина из API
      await authAPI.login(formData);
      
      // Если логин успешен, перенаправляем на профиль
      navigate('/profile');
    } catch (err) {
      // Обработка ошибок
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Вход в систему</h1>
      
      {/* Показываем ошибку, если есть */}
      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Поле Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Введите ваш email"
          />
        </div>

        {/* Поле Пароль */}
        <div>
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Введите пароль"
          />
        </div>

        {/* Кнопка входа */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      {/* Ссылка на регистрацию */}
      <p className='log-reg-link'>
        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
      </p>
    </div>
  );
}
