import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'normalize.css';
import './App.scss';
import { useHeaderSwitch } from './hooks/useHeaderSwitch';

import Home from './pages/home/Home';
import About from './pages/about/About';

import MobileHeader from './components/mobile-header/MobileHeader';
import MobileNavigation from './components/mobile-navigation/MobileNavigation';
import DesctopHeader from './components/desctop-header/DesctopHeader';

function App() {
  const isMobile = useHeaderSwitch('(max-width: 500px)');

  return (
    <Router>  
      <div className="app">
        <div>
          {isMobile ? (
            <>
              <MobileHeader />
              <MobileNavigation />
            </>
          ) : (
            <DesctopHeader />
          )}
        </div>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;