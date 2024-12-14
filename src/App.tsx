import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Businesses } from './pages/Businesses';
import { Attractions } from './pages/Attractions';
import { Events } from './pages/Events';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/events" element={<Events />} />
          <Route path="/businesses" element={<Businesses />} />
        </Routes>
        
        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 transition-colors duration-200">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} calcity.info. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;