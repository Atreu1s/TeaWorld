import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import "./DesctopHeader.scss";

const DesktopNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTabletView, setIsTabletView] = useState(window.innerWidth < 1000);
  const [isLoggedIn, setIsLoggedIn] = useState(authAPI.isLoggedIn());
  const navigate = useNavigate();

  // Отслеживаем авторизацию: другие вкладки + текущая вкладка
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(authAPI.isLoggedIn());
    };

    // 1. Слушаем изменения в ДРУГИХ вкладках (событие storage)
    window.addEventListener('storage', checkAuth);

    // 2. Периодическая проверка в ТЕКУЩЕЙ вкладке (раз в секунду)
    //    Нужно потому что localStorage.setItem() в той же вкладке НЕ триггерит событие 'storage'
    const interval = setInterval(checkAuth, 1000);

    // 3. Проверяем при монтировании
    checkAuth();

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  // Обработчик выхода
  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    if (isMenuOpen) setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const isTablet = window.innerWidth < 1000;
      setIsTabletView(isTablet);
      if (!isTablet && isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && isTabletView) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMenuOpen, isTabletView]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen && isTabletView) {
        toggleMenu();
      }
    };

    if (isMenuOpen && isTabletView) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, isTabletView]);
 
  if (isTabletView) {
    return (
      <>
        <div className='menu-area'>
          <div>
            <Link to="/" className='medium-logo'>TeaWorld</Link> 
            <button onClick={toggleMenu} className="desctop-menu-btn">
              Меню
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div 
            className="desktop-modal-overlay" 
            onClick={toggleMenu}
          >
            <div 
              className="desktop-modal-menu" 
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={toggleMenu} className="modal-close">
                ✕
              </button>
              
              <div className="modal-links">
                <Link to="/" onClick={toggleMenu}>Главная</Link>
                
                {/* ← Условное отображение пунктов меню */}
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" onClick={toggleMenu}>Профиль</Link>
                    <Link to="/teaworld" onClick={toggleMenu}>Чай</Link>
                    <Link to="/blog" onClick={toggleMenu}>Блог</Link>
                    <button className='exitButton' onClick={() => { handleLogout(); toggleMenu(); }} >
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
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Десктопная навигация — только логика отображения
  return (
    <nav className="desctop-navigation">
      <div className='nav-container'>
        <Link to="/" className='desctop-logo'>TeaWorld</Link>
        <div>
          <Link to="/">Главная</Link>
          
          {/* ← Условное отображение пунктов */}
          {isLoggedIn ? (
            <>
              <Link to="/profile">Профиль</Link>
              <Link to="/teaworld">Чай</Link>
              <Link to="/blog">Блог</Link>
              <button 
                onClick={handleLogout} 
                className='exitButton'
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/teaworld">Чай</Link>
              <Link to="/blog">Блог</Link>
              <Link to="/register">Зарегистрироваться</Link>
              <Link to="/auth">Войти</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavigation;