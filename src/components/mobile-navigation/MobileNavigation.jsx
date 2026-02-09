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
      <Link to="/about">About</Link>
      <Link to="/">Home</Link>
      
      <button onClick={toggleMenu} className="menu-toggle">
        {isMenuOpen ? "Закрыть" : "Меню"} 
      </button>
    </nav>
    {isMenuOpen && (
        <div className='hide-menu'>
          <Link to="/About" onClick={toggleMenu}>Страница</Link> 
          <Link to="/About" onClick={toggleMenu}>Страница</Link>
          <Link to="/About" onClick={toggleMenu}>Страница</Link> 

          <button onClick={toggleMenu} className="close-button">Закрыть</button>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;