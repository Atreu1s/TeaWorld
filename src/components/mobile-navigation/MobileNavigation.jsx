import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { authAPI } from '../../services/api'; // Убедитесь, что путь правильный
import './MobileNavigation.scss'; 

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authAPI.isLoggedIn()); // ← Состояние авторизации
  const navigate = useNavigate();

  // Отслеживаем авторизацию: другие вкладки + текущая вкладка
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(authAPI.isLoggedIn());
    };

    // Слушаем изменения в ДРУГИХ вкладках (событие storage)
    window.addEventListener('storage', checkAuth);

    // Периодическая проверка в ТЕКУЩЕЙ вкладке (раз в секунду)
    const interval = setInterval(checkAuth, 1000);

    // Проверяем при монтировании
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  // Обработчик выхода из системы
  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setIsMenuOpen(false); // Закрываем меню после выхода
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Блокировка прокрутки без сдвига
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    if (isMenuOpen) {
      // Добавляем отступ равный ширине скроллбара
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Убираем отступ и разрешаем прокрутку
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMenuOpen]);

  // Обработчик для закрытия по Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="mobile-navigation">
        <button onClick={toggleMenu} className="menu-toggle">
          Меню 
        </button>
      </nav>
      
      {isMenuOpen && (
        <div 
          className="hide-menu" 
          onClick={toggleMenu}
        >
          <Link to="/" onClick={toggleMenu}>Главная</Link> 
          
          {/* ← Условное отображение пунктов меню */}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={toggleMenu}>Профиль</Link>
              <Link to="/teaworld" onClick={toggleMenu}>Чай</Link> 
              <Link to="/blog" onClick={toggleMenu}>Блог</Link>
              <button 
                onClick={(e) => { e.stopPropagation(); handleLogout(); }} 
                className="exitButton"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/teaworld" onClick={toggleMenu}>Чай</Link> 
              <Link to="/blog" onClick={toggleMenu}>Блог</Link>
              <Link to="/register" onClick={toggleMenu}>Зарегистрироваться</Link> 
              <Link to="/auth" onClick={toggleMenu}>Войти</Link> 
            </>
          )}

          <button onClick={toggleMenu} className="close-button">Закрыть</button>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;