import { useState } from 'react';
import { teaTypes } from './TeaData';
import styles from './TeaTypes.module.scss';

const TeaTypes = () => {
  const [selectedTea, setSelectedTea] = useState(null);

  const openModal = (tea) => {
    setSelectedTea(tea);
    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedTea(null);
    // Восстанавливаем прокрутку
    document.body.style.overflow = 'auto';
  };

  // Закрытие по нажатию на клавишу Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  // Закрытие по клику на оверлей
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="tea-types-block">
      <h2>Основные виды чая</h2>
      <p className="intro-text">
        Все виды настоящего чая производятся из одного растения — <em>Camellia sinensis</em>. 
        Разница возникает из-за степени ферментации и технологии обработки.
      </p>

      {/* Сетка кнопок видов чая */}
      <div className={styles.teaTypesGrid}>
        {teaTypes.map((tea) => (
          <button
            key={tea.id}
            className={styles.teaTtypeBtn}
            onClick={() => openModal(tea)}
          >
            <strong><h3 className={styles.teaName}>{tea.name} <br></br></h3></strong>
            <span className="tea-desc">{tea.shortDesc}</span>
          </button>
        ))}
      </div>

      {/* Модальное окно */}
      {selectedTea && (
        <div 
          className="modal-overlay" 
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.teaModal}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Закрыть">
              ✕
            </button>
            <div className={styles.teaFlexblock}>
              
              <div className="body-area">
                <div className="modal-header">
                  <h3 className={styles.modalTitle}>{selectedTea.name}</h3>
                </div>
                
                <div className={styles.modalContent}>
                  <div className="modal-section">
                    <h4>📜 История</h4>
                    <p>{selectedTea.history}</p>
                  </div>
                  
                  <div className="modal-section">
                    <h4>📝 Описание</h4>
                    <p>{selectedTea.description}</p>
                    {selectedTea.note && (
                      <p className="modal-note"><strong>ℹ️ Важно:</strong> {selectedTea.note}</p>
                    )}
                  </div>
                  
                  <div className="modal-section">
                    <h4>☕ Как заваривать</h4>
                    <p>{selectedTea.brewing}</p>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default TeaTypes;