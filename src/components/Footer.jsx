import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#1A1A1D] border-t-2 border-gray-200 dark:border-gray-600 py-3 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src="/logo3.png" 
                alt="Logo" 
                className="w-12 h-12 object-contain transition-all duration-700 ease-in-out transform group-hover:scale-110 group-hover:rotate-[360deg] dark:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                rey-dev
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} POS System. All rights reserved.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Retail Management v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
