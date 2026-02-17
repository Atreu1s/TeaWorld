import { useState, useEffect } from 'react';
import styles from './TeaRec.module.scss';
import DayTea from './DayTea.js';
import seasonRec from './RecTea.jsx';

const TeaRecomend = () => {
  const [currentTea, setCurrentTea] = useState(null);

  useEffect(() => {
    const getTeaForToday = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const sequenceKey = 'teaDaySequence';
      const startDateKey = 'teaSequenceStartDate';
      
      const savedSequence = localStorage.getItem(sequenceKey);
      const savedStartDate = localStorage.getItem(startDateKey);
      
      let sequence = [];
      let startDate = null;
      
      if (savedSequence && savedStartDate) {
        sequence = JSON.parse(savedSequence);
        startDate = new Date(savedStartDate);
      }
      
      const daysSinceStart = savedStartDate 
        ? Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) 
        : null;
      
      const needNewSequence = !savedSequence || 
                             !savedStartDate || 
                             daysSinceStart >= 53;
      
      if (needNewSequence) {
        const newSequence = generateRandomSequence(DayTea.length);
        const newStartDate = today;
        
        localStorage.setItem(sequenceKey, JSON.stringify(newSequence));
        localStorage.setItem(startDateKey, newStartDate.toISOString());
        
        sequence = newSequence;
        startDate = newStartDate;
      }
      
      const currentDayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      const teaIndex = sequence[currentDayIndex % sequence.length];
      
      return DayTea[teaIndex];
    };
    
    setCurrentTea(getTeaForToday());
  }, []);
  
  const generateRandomSequence = (length) => {
    const array = Array.from({ length }, (_, i) => i);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  if (!currentTea) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.recArea}>
      <div className={styles.dayRecTea}>
        <h2 className="section-title">Чай дня</h2>
        <img 
          src={currentTea.img}
          alt={`Чай дня: ${currentTea.title}`} 
          className="tea-image"
          aria-hidden="true"
          loading="lazy"
        />
        <h3 className="tea-name">{currentTea.title}</h3>
        
        <div className="tea-details">
          <p><span className="detail-label"><strong>Дата открытия:</strong></span> {currentTea.openedDate}</p>
          <p><span className="detail-label"><strong>Тип чая:</strong></span> {currentTea.type}</p>
          <p><span className="detail-label"><strong>Вкусовой профиль:</strong></span> {currentTea.taste}</p>
        </div>
        
        <p className="tea-description">{currentTea.description}</p>
      </div>

      <div className={styles.seasonRecArea}>
        <h2 className="section-title">Сезонные рекомендации</h2>
        
        <div className={styles.seasonRecarea}>
          <div className={styles.seasonRecElem}>
            {seasonRec.map((item) => (
            <div key={item.id} className={styles.seasonRecCard}>
              <h3 className="season-name">{item.season}</h3>
              <p className="season-desc">{item.recommendation}</p>
            </div>
          ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TeaRecomend;