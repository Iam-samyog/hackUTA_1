import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  // Smooth scroll to section and close menu if mobile
  const scrollToSection = (id) => {
    // Only scroll to sections if we're on the home page
    if (location.pathname === "/" && !isAuthenticated) {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Determine if we should show landing page links
  const showLandingLinks = location.pathname === "/" && !isAuthenticated;

  // Debug logging for navbar state
  console.log("Navbar Debug:", {
    isAuthenticated,
    user,
    location: location.pathname,
    authToken: localStorage.getItem("auth_token") ? "present" : "missing",
  });

  // Enhanced auth check - also check localStorage token
  const hasAuthToken = localStorage.getItem("auth_token");
  const shouldRedirectToDashboard = isAuthenticated || hasAuthToken;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-200 pt-1 bg-white/70 mb-7">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo with Smart Redirect */}
          <Link
            to={shouldRedirectToDashboard ? "/dashboard" : "/"}
            className="flex items-center"
          >
            <img
              src="/Logo.svg"
              alt="NoteLens Logo"
              className="h-auto w-[80px]"
            />
          </Link>

          {/* Desktop Links + Search + Button */}
          <div className="hidden md:flex items-center space-x-6">
            {showLandingLinks && (
              <>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-black hover:text-blue-600 font-semibold transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-black hover:text-blue-600 font-semibold transition-colors"
                >
                  How it Works
                </button>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-black hover:text-blue-600 font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/search"
                  className="text-black hover:text-blue-600 font-semibold transition-colors"
                >
                  Search
                </Link>
                <Link
                  to="/profile"
                  className="text-black hover:text-blue-600 font-semibold transition-colors"
                >
                  Profile
                </Link>
              </>
            )}

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-400"
            >
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none text-gray-700 bg-transparent w-40"
              />
            </form>

            {/* Authentication Button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm">
                  Welcome, {user?.username || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2 bg-blue-800 font-bold text-white rounded-lg hover:bg-blue-600 hover:text-white hover:border-black transition-all hover:scale-105">
                  Get Started
                </button>
              </Link>
            )}
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
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {/* Mobile Logo with Smart Redirect */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="text-xl font-poppins font-bold text-blue-900"
          >
            NoteLens
          </Link>
          <button onClick={toggleMenu}>
            <FontAwesomeIcon icon={faTimes} size="lg" className="text-black" />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mx-6 mt-4"
        >
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-transparent text-gray-700 w-full"
          />
        </form>

        {/* Mobile Links */}
        <div className="flex flex-col mt-6 space-y-4 px-6">
          {showLandingLinks && (
            <>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-blue-600 font-semibold text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 hover:text-blue-600 font-semibold text-left"
              >
                How it Works
              </button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <button className="text-gray-700 hover:text-blue-600 font-semibold text-left">
                  Dashboard
                </button>
              </Link>
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                <button className="text-gray-700 hover:text-blue-600 font-semibold text-left">
                  Search
                </button>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <button className="text-gray-700 hover:text-blue-600 font-semibold text-left">
                  Profile
                </button>
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all text-left"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </Link>
          )}
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