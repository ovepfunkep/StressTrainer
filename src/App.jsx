import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import TrainingScreen from './components/TrainingScreen';
import StatsScreen from './components/StatsScreen';
import DictionaryScreen from './components/DictionaryScreen';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <div className="min-h-screen bg-background">
          <main className="pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<TrainingScreen />} />
              <Route path="/stats" element={<StatsScreen />} />
              <Route path="/dictionary" element={<DictionaryScreen />} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
