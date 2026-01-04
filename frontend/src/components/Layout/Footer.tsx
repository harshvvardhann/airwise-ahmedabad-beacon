
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} AirWise. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-primary">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>Data provided by OpenAQ. This is a demo project.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
