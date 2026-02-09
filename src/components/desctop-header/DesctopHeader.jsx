import { Link } from 'react-router-dom'; 
import './DesctopHeader.scss'; 

const DesctopHeader = () => {
  return (
    <nav className="desctop-navigation">
      <Link to="/Home">Logo</Link>
      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/menu">Menu</Link>
      </div>
      
    </nav>
  );
};

export default DesctopHeader;