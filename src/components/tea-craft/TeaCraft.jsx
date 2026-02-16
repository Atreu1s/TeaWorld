import './TeaCraft.scss';

const icon1 = "/infoimg/tea-leaf.png";
const icon2 = "/infoimg/drop.png";
const icon3 = "/infoimg/clock.png";
const icon4 = "/infoimg/thermometer.png";
const icon5 = "/infoimg/teaitems.png";
const icon6 = "/infoimg/cup-of-drink.png";

const CraftSteps = [
  { id: 1, icon: icon1, title: 'Выбор чая', description: 'Выберите свежий чай высокого качества' },
  { id: 2, icon: icon2, title: 'Вода', description: 'Используйте фильтрованную воду' },
  { id: 3, icon: icon3, title: 'Время', description: 'Соблюдайте время заваривания (2-5 минут)' },
  { id: 4, icon: icon4, title: 'Температура', description: 'Подбирайте температуру воды под вид чая' },
  { id: 5, icon: icon5, title: 'Посуда', description: 'Используйте чайники и сито из стекла, керамики или нержавейки.' },
  { id: 6, icon: icon6, title: 'Наслаждение', description: 'Наслаждайтесь моментом!' }
]

const TeaCraft = () => {
  return (
    <div className="tea-craft-guide">
      <h2>Как правильно заварить чай</h2>
      
      <div className="steps-container">
        {CraftSteps.map((step) => ( //Убрал index, попробовать без цифры
          <div key={step.id + 1} className="step">
            {/* <div className="step-number"> <p> {index + 1}</p></div> */}

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