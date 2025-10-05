import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSignOutAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from "./Search.jsx";

const NavbarNew = ({ user, logout, setShowCreateModal, showDebugger, setShowDebugger }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

  <nav className="fixed top-0 mb-[50px] left-0 right-0 z-50 backdrop-blur-md border-b border-gray-200 py-2 bg-white/80">
        <div className="max-w-7xl mx-auto px-6 pt-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="">
             <Link to="/" className="flex items-center">
             <img 
               src="/Logo.svg" 
               alt="Logo" 
               className="h-20 md:h-24 w-auto" 
             />
           </Link>
            </div>
            
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/profile"
              className="text-black hover:text-blue-600 font-poppins font-semibold transition-colors"
            >
              Profile
            </Link>
            <Link
              to="/courses"
              className="text-black hover:text-blue-600 font-poppins font-semibold transition-colors"
            >
              Courses
            </Link>
            <Link
              to="/search"
              className="text-blue-600 font-poppins font-semibold"
            >
              Search
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-poppins font-semibold"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Course
            </button>
            <button
              onClick={() => setShowDebugger(!showDebugger)}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-poppins font-semibold"
            >
              Debug API
            </button>
            <span className="text-gray-600 text-sm">
              Welcome, {user?.username || "User"}!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-poppins font-semibold"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
            </button>
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
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-2xl font-poppins font-bold text-blue-900">
            NoteLens
          </span>
          <button onClick={toggleMenu}>
            <FontAwesomeIcon icon={faTimes} size="lg" className="text-black" />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col mt-6 space-y-4 px-6">
          <Link
            to="/profile"
            className="text-gray-700 hover:text-blue-600 font-poppins font-semibold text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/courses"
            className="text-gray-700 hover:text-blue-600 font-poppins font-semibold text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/search"
            className="text-blue-600 font-poppins font-semibold text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Search
          </Link>
          <button
            onClick={() => {
              setShowCreateModal(true);
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white font-poppins font-semibold rounded-full hover:bg-blue-700 transition-all text-left"
          >
            Create Note
          </button>
          <button
            onClick={() => {
              setShowDebugger(!showDebugger);
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-red-600 text-white font-poppins font-semibold rounded-full hover:bg-red-700 transition-all text-left"
          >
            Debug API
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-poppins font-semibold rounded-full hover:bg-gray-300 transition-all text-left"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default NavbarNew;