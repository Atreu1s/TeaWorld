import { useState } from 'react'; // Обязательно импортируем!
import { Link } from 'react-router-dom'; 
import './MobileNavigation.scss'; 

const MobileNavigation = () => {
  // Состояние объявляем ПРЯМО В КОМПОНЕНТЕ
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Функцию тоже объявляем внутри компонента
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <nav className="mobile-navigation">
      {/* Основные ссылки всегда видны */}
      <Link to="/about">Профиль</Link>
      <Link to="/">Главная</Link>
      
      <button onClick={toggleMenu} className="menu-toggle">
        {isMenuOpen ? "Закрыть" : "Меню"} 
      </button>
    </nav>
    {isMenuOpen && (
        <div className='hide-menu'>
          <Link to="/" onClick={toggleMenu}>Главная</Link> 
          <Link to="/" onClick={toggleMenu}>Профиль</Link>
          <Link to="/teaworld" onClick={toggleMenu}>Чай</Link> 
          <Link to="/register" onClick={toggleMenu}>Зарегистрироваться</Link> 
          <Link to="/auth" onClick={toggleMenu}>Войти</Link> 
          <Link to="/about" onClick={toggleMenu}>О нас</Link> 


          <button onClick={toggleMenu} className="close-button">Закрыть</button>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;