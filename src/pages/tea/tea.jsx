import TeaSlider from './components/TeaSlider/TeaSlider';
import TeaTypes from './components/TeaTypes/TeaTypes'; 
import TeaMap from './components/TeaMap/TeaMap';
import TeaRecomend from './components/TeaRecomendation/TeaRec';
import './tea.scss';

const TeaWorld = () => {
  return (
    <main className="tea-page">
      
      <section className="tea-hero-section">
        <TeaSlider />
      </section>
      
      <section className='body-area'>
        
        <section>
          <div className="TeaMainBody">
            
            <div>
              <h1 className='TeaTitle'>Чай: история в каждой чашке</h1>
              <div className="teaText">
                <p>
                  Чай — это больше, чем просто напиток. Это история целых цивилизаций, 
                  философия умиротворения и искусство вкуса. Мы собрали для вас всё самое 
                  интересное о чае: от его древнего происхождения до современных тенденций.
                </p>
                <div>
                  <p className="accentP">
                    <strong>Знаете ли вы?</strong> Чай был открыт случайно более 5000 лет назад 
                    китайским императором Шэнь-Нуном, когда листья чайного дерева упали в кипящую воду.
                  </p>
                </div>
                
                
                
              </div>
            </div>
            
            <div className='map-area'>
              <TeaMap />
            </div>

          </div>
        </section>

        <div>
          <p className='MiddleTextOnPage'>
            Все виды настоящего чая производятся из одного растения — <em>Camellia sinensis</em>. 
            Разница между ними возникает только благодаря технологии обработки и степени 
            ферментации. Откройте для себя удивительное разнообразие этого благородного напитка!
          </p>
        </div>

        <section className="tea-types-section">
          <TeaTypes />
        </section>

        <section>
          <TeaRecomend />
        </section>
        
      </section>
      

    </main>
  );
};

export default TeaWorld;