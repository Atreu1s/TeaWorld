import "./home.scss";
import { Link } from "react-router-dom";
import TeaCraft from "../../components/tea-craft/TeaCraft";
import MainSitat from "../../components/main-sitat/MainSitat";

const Home = () => {
  return (
    <section className="body-area">
      <div className="main-text">
        <h1>Путешествие в мир чая</h1>
        <h2>От древних традиций до современных рецептов</h2>
        <p>Чай — это больше, чем просто напиток. Это история целых цивилизаций, 
  философия умиротворения и искусство вкуса. Мы собрали для вас всё самое 
  интересное о чае: от его древнего происхождения до современных тенденций. 
  Откроете для себя истинную культуру чаепития, узнаете секреты заваривания 
  и погрузитесь в удивительную историю этого благородного напитка.</p>
        <Link to="/teaworld">Виды чая</Link>
      </div>
      <div>
        <TeaCraft />
      </div>
      <div>
        <MainSitat />
      </div>
    </section>
    
  );
};

export default Home;