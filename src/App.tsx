import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchAlgorithms from './pages/SearchAlgorithms';
import SortingAlgorithms from './pages/SortingAlgorithms';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchAlgorithms />} />
            <Route path="/sort" element={<SortingAlgorithms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;