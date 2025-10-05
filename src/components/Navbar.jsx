import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Smooth scroll to section and close menu if mobile
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-200 py-2 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <span className="text-xl font-poppins font-bold text-blue-900">NoteLens</span>
          </div>

          {/* Desktop Links + Search + Button */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-black hover:text-blue-600 font-semibold transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-black hover:text-blue-600 font-semibold transition-colors"
            >
              How it Works
            </button>

            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-400">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none text-gray-700 bg-transparent w-40"
              />
            </div>

            {/* Get Started Button */}
            <Link to="/login">
              <button className="px-6 py-2 bg-blue-800 font-bold text-white rounded-lg hover:bg-blue-600 hover:text-white hover:border-black transition-all hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} size="lg" className="text-black" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-xl font-poppins font-bold text-blue-900">NoteLens</span>
          <button onClick={toggleMenu}>
            <FontAwesomeIcon icon={faTimes} size="lg" className="text-black" />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mx-6 mt-4">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-transparent text-gray-700 w-full"
          />
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col mt-6 space-y-4 px-6">
          <button
            onClick={() => scrollToSection('features')}
            className="text-gray-700 hover:text-blue-600 font-semibold text-left"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-gray-700 hover:text-blue-600 font-semibold text-left"
          >
            How it Works
          </button>
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;
