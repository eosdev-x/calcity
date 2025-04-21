import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Businesses } from './pages/Businesses';
import { BusinessDetails } from './pages/BusinessDetails';
import { BusinessProfileCreation } from './pages/BusinessProfileCreation';
import { Pricing } from './pages/Pricing';
import { Guide } from './pages/Guide';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingChatWidget } from './components/FloatingChatWidget';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/businesses/new" element={<BusinessProfileCreation />} />
            <Route path="/businesses/:id" element={<BusinessDetails />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </main>
        <Footer />
        <FloatingChatWidget />
      </div>
    </Router>
  );
}

export default App;