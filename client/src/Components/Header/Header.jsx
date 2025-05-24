import React from 'react'
const Header = () => {
    return (
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">GetJob</h1>
          </div>
          <div className="flex space-x-6 text-sm font-medium">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Sign Up
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Login
            </a>
          </div>
        </div>
      </div>
    );
  };

export default Header