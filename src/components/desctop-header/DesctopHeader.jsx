import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "./DesctopHeader.scss";

const DesktopNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTabletView, setIsTabletView] = useState(window.innerWidth < 1000);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const isTablet = window.innerWidth < 1000;
      setIsTabletView(isTablet);
      
      if (!isTablet && isMenuOpen) {
        setIsMenuOpen(false);
      }
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
                <Link to="/profile" onClick={toggleMenu}>Профиль</Link>
                <Link to="/teaworld" onClick={toggleMenu}>Чай</Link> 
                <Link to="/blog" onClick={toggleMenu}>Блог</Link> 
                <Link to="/register" onClick={toggleMenu}>Зарегистрироваться</Link> 
                <Link to="/auth" onClick={toggleMenu}>Войти</Link> 
                
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  
  return (
    <nav className="desctop-navigation">
      <div className='nav-container'>
        <Link to="/">TeaWorld</Link>
        <div>
          <Link to="/" >Главная</Link> 
          <Link to="/profile" >Профиль</Link>
          <Link to="/teaworld" >Чай</Link> 
          <Link to="/blog" >Блог</Link> 
          <Link to="/register" >Зарегистрироваться</Link> 
          <Link to="/auth" >Войти</Link> 
          
        </div>
      </div>
      
      
    </nav>
  );
};

export default DesktopNavigation;