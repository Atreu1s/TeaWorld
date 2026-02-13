import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import slides from './TeaSlides.js';
import styles from './TeaSlider.module.scss';

const TeaSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, 
    delta: 50, 
  });

  return (
    <div 
      className={styles.teaSlider} 
      style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      {...swipeHandlers} // Применяем обработчики свайпа
    >
      <div className="carousel-slide">
        <div className={styles.slideContent}>
          <h2 className="slide-title">{slides[currentSlide].title}</h2>
          <p className="slide-description">{slides[currentSlide].description}</p>
        </div>
      </div>

      <button className={styles.carouselBtnPrev} onClick={prevSlide} aria-label="Предыдущий слайд">
        ←
      </button>
      <button className={styles.carouselBtnNext} onClick={nextSlide} aria-label="Следующий слайд">
        →
      </button>

      {/* Индикаторы слайдов */}
      <div className={styles.carouselIndicators}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Слайд ${index + 1}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default TeaSlider;