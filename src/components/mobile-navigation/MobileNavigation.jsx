import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './MobileNavigation.scss'; 

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link to="/profile" onClick={toggleMenu}>Профиль</Link>
          <Link to="/teaworld" onClick={toggleMenu}>Чай</Link> 
          <Link to="/register" onClick={toggleMenu}>Зарегистрироваться</Link> 
          <Link to="/auth" onClick={toggleMenu}>Войти</Link> 
          <Link to="/blog" onClick={toggleMenu}>Блог</Link> 

          <button onClick={toggleMenu} className="close-button">Закрыть</button>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;