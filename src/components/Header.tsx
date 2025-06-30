import React from 'react';
import { Zap, Calendar, Clock } from 'lucide-react';

const Header: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Energy Management Dashboard</h1>
              <p className="text-sm text-gray-600">University Campus Energy Monitoring System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{currentDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;