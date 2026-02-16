import styles from './TeaRec.module.scss';
import DayTea from './DayTea.js';
import seasonRec from './RecTea.js';

const TeaRecomend = () => {
  const currentTea = DayTea[0];

  return (
    <div className={styles.recArea}>
      <div className={styles.dayRecTea}>
        <h2 className="section-title">Чай дня</h2>
        <h3 className="tea-name">{currentTea.title}</h3>
        
        <div className="tea-details">
          <p><span className="detail-label">Дата открытия:</span> {currentTea.openedDate}</p>
          <p><span className="detail-label">Тип чая:</span> {currentTea.type}</p>
          <p><span className="detail-label">Вкусовой профиль:</span> {currentTea.taste}</p>
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