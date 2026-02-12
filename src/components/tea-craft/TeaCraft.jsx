import './TeaCraft.scss';

import icon1 from '../../../public/infoimg/tea-leaf.png';
import icon2 from '../../../public/infoimg/drop.png';
import icon3 from '../../../public/infoimg/clock.png';
import icon4 from '../../../public/infoimg/thermometer.png';
import icon5 from '../../../public/infoimg/cup-of-drink.png';

const CraftSteps = [
  { id: 1, icon: icon1, title: 'Выбор чая', description: 'Выберите свежий чай высокого качества' },
  { id: 2, icon: icon2, title: 'Вода', description: 'Используйте фильтрованную воду' },
  { id: 3, icon: icon3, title: 'Время', description: 'Соблюдайте время заваривания (2-5 минут)' },
  { id: 4, icon: icon4, title: 'Температура', description: 'Подбирайте температуру воды под вид чая' },
  { id: 5, icon: icon5, title: 'Наслаждение', description: 'Наслаждайтесь моментом!' }
]

const TeaCraft = () => {
  return (
    <div className="tea-craft-guide">
      <h2>Как правильно заварить чай</h2>
      
      <div className="steps-container">
        {CraftSteps.map((step, index) => (
          <div key={step.id} className="step">
            <div className="step-number"> <p> {index + 1}</p></div>

            <div className='icon-container'>
              <img src={step.icon} alt={step.title} className="step-icon"/>
              <div className='step-text'>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeaCraft;