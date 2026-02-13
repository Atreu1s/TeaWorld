import { useState, useEffect } from 'react';
import WorldMapSVG from '/world.svg';
import './TeaMap.scss';

const teaCountryCodes = ['China', 'India', 'Kenya', 'SriLanka', 'Japan', 'Turkey', 'Vietnam', 'Indonesia'];

const teaCountryNames = {
  China: 'Китай',
  India: 'Индия',
  Kenya: 'Кения',
  SriLanka: 'Шри-Ланка',
  Japan: 'Япония',
  Turkey: 'Турция',
  Vietnam: 'Вьетнам',
  Indonesia: 'Индонезия'
};

const TeaMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    const svgObject = document.getElementById('world-map-object');
    
    const handleLoad = () => {
      const svgDoc = svgObject.contentDocument;
      const svg = svgDoc.querySelector('svg');
      
           
      teaCountryCodes.forEach(code => {
        const path = svg.querySelector(`.${code}`);
        if (path) {
          path.classList.add('tea-country');
          path.addEventListener('mouseenter', () => setHoveredCountry(code));
          path.addEventListener('mouseleave', () => setHoveredCountry(null));
        }
      });
      
       const allPaths = svg.querySelectorAll('path');
      allPaths.forEach(path => {
        if (!path.classList.contains('tea-country')) {
          path.classList.add('other-country');
        }
      });
    };
    
    if (svgObject) {
      svgObject.addEventListener('load', handleLoad);
    }
    
    return () => {
      if (svgObject) {
        svgObject.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  return (
    <div className="tea-map">
      <object
        id="world-map-object"
        type="image/svg+xml"
        data={WorldMapSVG}
        className="world-map-svg"
        aria-label="Карта мира с чайными регионами"
      >
        Ваш браузер не поддерживает SVG
      </object>
      
      {hoveredCountry && (
        <div className="country-info">
          <h3>{teaCountryNames[hoveredCountry]}</h3>
          <p>Страна-производитель чая</p>
        </div>
      )}
    </div>
  );
};

export default TeaMap;