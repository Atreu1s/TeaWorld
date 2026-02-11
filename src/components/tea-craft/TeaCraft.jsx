import './TeaCraft.scss';

const CraftSteps = [
  { id: 1, icon: 'Иконка', title: 'Выбор чая', description: 'Выберите свежий чай высокого качества' },
  { id: 2, icon: 'Иконка', title: 'Вода', description: 'Используйте фильтрованную воду' },
  { id: 3, icon: 'Иконка', title: 'Время', description: 'Соблюдайте время заваривания (2-5 минут)' },
  { id: 4, icon: 'Иконка', title: 'Температура', description: 'Подбирайте температуру воды под вид чая' },
  { id: 5, icon: 'Иконка', title: 'Наслаждение', description: 'Наслаждайтесь моментом!' }
]

const TeaCraft = () => {
  return (
    <div className="tea-craft-guide">
      <h2>Как правильно заварить чай</h2>
      
      <div className="steps-container">
        {CraftSteps.map((step, index) => (
          <div key={step.id} className="step">
            <div className="step-number">{index + 1}</div>

            <div className='icon-container'>
              <div className="step-icon">{step.icon}</div>
              <div className='step-text'>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
            
            
            {/* Стрелка между шагами 
            {index < CraftSteps.length - 1 && (
              <div className="step-arrow">→</div>
            )}*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeaCraft;