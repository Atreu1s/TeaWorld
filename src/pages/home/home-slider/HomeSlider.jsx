import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import slides from './HomeSliderData.js';
import styles from './HomeSlider.module.scss';

const HomeSlider = () => {
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
      className={styles.homeSlider} 
      style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      {...swipeHandlers}
      aria-label="Main slider"
    >
      <div className={styles.slideContentArea}>
        <div className={styles.slideContent}>
          <div>
            <h2>{slides[currentSlide].title}</h2>
            <p>{slides[currentSlide].description}</p>
          </div>
          
        </div>
      </div>

      <button 
        className={styles.carouselBtnPrev} 
        onClick={prevSlide}
        aria-label="Предыдущий слайд"
      >
        ←
      </button>
      <button 
        className={styles.carouselBtnNext} 
        onClick={nextSlide}
        aria-label="Следующий слайд"
      >
        →
      </button>

      <div className={styles.carouselIndicators}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Слайд ${index + 1}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;