
import React from 'react';
import { Link } from 'react-router-dom';
import { Wind } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Wind className="h-8 w-8 text-primary mr-2" />
            <Link to="/" className="text-xl font-bold text-gray-900">
              <span className="text-primary">Air</span>
              <span className="text-secondary">Wise</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors">
              About
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
