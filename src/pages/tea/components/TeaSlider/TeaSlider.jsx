import { useState, useEffect } from 'react';
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

  return (
    <div className={styles.teaSlider} style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
      <div className="carousel-slide">
        
        <div className={styles.slideContent}>
          <h2 className="slide-title">{slides[currentSlide].title}</h2>
          <p className="slide-description">{slides[currentSlide].description}</p>
        </div>
      </div>

      {/* Кнопки навигации */}
      <button className={styles.carouselBtnPrev} onClick={prevSlide} aria-label="Предыдущий слайд">
        ←
      </button>
      <button className={styles.carouselBtnNext} onClick={nextSlide} aria-label="Следующий слайд">
        →
      </button>

      {/* Индикаторы слайдов */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Слайд ${index + 1}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default TeaSlider;