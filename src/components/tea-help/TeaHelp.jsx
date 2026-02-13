import './TeaHelp.scss';
import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import benefits from './TeaHelpsInfo.js';

const TeaHelp = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % benefits.length);
  }, 8000);

  return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % benefits.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 50,
  });

  const currentBenefit = benefits[currentSlide];

  return (
    <section className='TeaHelpArea' {...swipeHandlers}>
      <div>
        <div className="HelpTeaHeader">
          <h2>Польза чая</h2>
        </div>

        <div className="HelpSlidesArea">
          <div className="HelpSlidesTitle">
          <span className="HelpSlideIcon">{currentBenefit.icon}</span>
          <h3 className="HelpSlideTitle">{currentBenefit.title}</h3>
        </div>
        
        
        <p className="HelpSlideDescription">{currentBenefit.description}</p>
      </div>


      <div className="carouselIndicators">
        {benefits.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Польза ${index + 1}`}
          ></span>
        ))}
      </div>
      </div>
      

      

      {/* <div className="benefits-stats">
        <div className="stat-item">
          <span className="stat-number">3-5</span>
          <span className="stat-label">чашек в день</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">60-80°C</span>
          <span className="stat-label">оптимальная температура</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">15-20</span>
          <span className="stat-label">минут заваривания</span>
        </div>
      </div> */}
    </section>
  );
};

export default TeaHelp;