import "./MainFooter.scss";
import footerSVG from "./footer.svg?raw";

const MainFooter = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-info">
          <h3>Используемые технологии:</h3>
          <ul className="tech-list">
            <li>React</li>
            <li>React Router</li>
            <li>SCSS</li>
            <li>Axios</li>
            <li>Node.js</li>
            <li>Express</li>
            <li>MongoDB</li>
            <li>Mongoose</li>
            <li>JWT</li>
            <li>bcryptjs</li>
            <li>Vite</li>
            <li>ESLint</li>
          </ul>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Чайный мир. Все права защищены.</p>
          <p className="made-by">Разработано на React</p>
        </div>
      </div>
      
      {/* Декоративная волна */}
      {/* <div 
        className="footer-wave"
        dangerouslySetInnerHTML={{ __html: footerSVG }}
      /> */}
    </footer>
  );
};

export default MainFooter;