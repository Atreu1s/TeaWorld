if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import 'normalize.css';
import './App.scss';
import { useHeaderSwitch } from './hooks/useHeaderSwitch';

import Home from './pages/home/Home';
import Register from './pages/register/register';
import Auth from './pages/login/login';
import TeaWorld from './pages/tea/tea';
import Profile from './pages/profile/Profile';
import Blog from './pages/blog/blog';
import FullPostView from './components/FullPostView/FullPostView';
import BlogEditPost from './pages/PostRedactor/PostEditPost';

import MobileHeader from './components/mobile-header/MobileHeader';
import MobileNavigation from './components/mobile-navigation/MobileNavigation';
import DesctopHeader from './components/desctop-header/DesctopHeader';
import MainFooter from './components/main-footer/MainFooter';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


function App() {
  const isMobile = useHeaderSwitch('(max-width: 500px)');

  return (
    <Router>  
      <ScrollToTop />
      <div className="app">
        <div>
          {isMobile ? (
            <>
              <MobileHeader />
              <MobileNavigation />
            </>
          ) : (
            <>
            <DesctopHeader />
            
            </>
          )}
        </div>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teaworld" element={<TeaWorld />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<FullPostView />} />
            <Route path="/blog/edit/:id" element={<BlogEditPost />} />
          </Routes>
        </main>
        <MainFooter />
      </div>
    </Router>
  );
}

export default App;