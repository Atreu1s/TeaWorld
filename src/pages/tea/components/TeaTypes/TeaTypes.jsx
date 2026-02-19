// src/components/tea/TeaTypes.jsx
import { useState } from 'react';
import { teaTypes } from './TeaData';
import ModalTea from '../../../../components/modalTea/ModalTea';
import styles from './TeaTypes.module.scss';

const TeaTypes = () => {
  const [selectedTea, setSelectedTea] = useState(null);

  const openModal = (tea) => setSelectedTea(tea);
  const closeModal = () => setSelectedTea(null);

  return (
    <div className={styles.teaTtypeh2}>
      <h2>Основные виды чая</h2>

      <div className={styles.teaTypesGrid}>
        {teaTypes.map((tea) => (
          <button
            key={tea.id}
            className={styles.teaTtypeBtn}
            onClick={() => openModal(tea)}
          >
            <strong><h3 className={styles.teaName}>{tea.name}</h3></strong>
            <span className="tea-desc">{tea.shortDesc}</span>
          </button>
        ))}
      </div>

      <ModalTea
        isOpen={!!selectedTea}
        onClose={closeModal}
        title={selectedTea?.name}
      >
        <div className={styles.modalContent}>
          <div className="modal-section">
            <h4>История</h4>
            <p>{selectedTea?.history}</p>
          </div>
          
          <div className="modal-section">
            <h4>Описание</h4>
            <p>{selectedTea?.description}</p>
            {selectedTea?.note && (
              <p className="modal-note"><strong>Важно:</strong> {selectedTea.note}</p>
            )}
          </div>
          
          <div className="modal-section">
            <h4>Как заваривать</h4>
            <p>{selectedTea?.brewing}</p>
          </div>
        </div>
      </ModalTea>
    </div>
  );
};

export default TeaTypes;