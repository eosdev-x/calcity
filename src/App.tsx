import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Businesses } from './pages/Businesses';
import { Attractions } from './pages/Attractions';
import { Events } from './pages/Events';
import { Contact } from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/attractions" element={<Attractions />} />
            <Route path="/events" element={<Events />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 transition-colors duration-200">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} calcity.info. All rights reserved.</p>
            <p className="mt-2">Site by:{' '}  
              <a
                href="https://eosdev.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                eosdev
              </a>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;