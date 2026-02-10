import { Link } from 'react-router-dom'; 
import './DesctopHeader.scss'; 

const DesctopHeader = () => {
  return (
    <nav className="desctop-navigation">
      <Link to="/Home">Logo</Link>
      <div>
        <Link to="/" >Главная</Link> 
        <Link to="/" >Профиль</Link>
        <Link to="/teaworld" >Чай</Link> 
        <Link to="/register" >Зарегистрироваться</Link> 
        <Link to="/auth" >Войти</Link> 
        <Link to="/about" >О нас</Link>
      </div>
      
    </nav>
  );
};

export default DesctopHeader;