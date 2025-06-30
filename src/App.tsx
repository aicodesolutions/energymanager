import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationHeader from './components/NavigationHeader';
import HomePage from './pages/HomePage';
import CampusMapPage from './pages/CampusMapPage';
import EquipmentDatabase from './components/EquipmentDatabase';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/campus-map" element={<CampusMapPage />} />
          <Route path="/equipment-database" element={
            <div className="pt-16">
              <EquipmentDatabase />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;