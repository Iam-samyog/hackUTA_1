import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getPublicNotes } from "../services/notesService.js";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faPlus,faSearch, faSort,faSignOutAlt, faFilter, faTimesCircle, faArrowRight, faFileAlt } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false); // New state for animation

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [allNotes, searchQuery, sortBy, filterBy]);

  useEffect(() => {
    // Trigger animation when component mounts
    setIsSearchBoxVisible(true);
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const notesData = await getPublicNotes();
      setAllNotes(notesData);
    } catch (error) {
      setError("Failed to fetch notes");
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortNotes = () => {
    let filtered = [...allNotes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.description?.toLowerCase().includes(query) ||
          note.owner?.username.toLowerCase().includes(query)
      );
    }

    // Apply visibility filter
    if (filterBy !== "all") {
      filtered = filtered.filter((note) => {
        if (filterBy === "public") return note.is_public;
        if (filterBy === "private") return !note.is_public;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredNotes(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setFilterBy("all");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes slideInCard {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-card {
          animation: slideInCard 0.3s ease-out;
        }

        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-slide-up {
          animation: fadeInSlideUp 0.5s ease-out forwards;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-200 py-2 bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <Link to="/" className="text-2xl font-poppins font-bold text-blue-900">
              NoteLens
            </Link>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-md">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-4 text-sm underline hover:text-red-900"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-poppins font-bold text-gray-900 mb-3">
            Search Notes
          </h1>
          <p className="text-gray-600 text-xl">
            Find notes using search and filters
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl shadow-xl p-8 mb-12 border border-blue-700 ${isSearchBoxVisible ? 'animate-fade-in-slide-up' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Search Input */}
            <div className="md:col-span-2" role="search">
              <label className="block text-sm font-medium text-white mb-2">
                Search
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-4.5 h-5 w-5 text-gray-600"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, description, or username..."
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  aria-label="Search notes"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FontAwesomeIcon icon={faSort} className="mr-1" /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                aria-label="Sort notes"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            {/* Filter By */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FontAwesomeIcon icon={faFilter} className="mr-1" /> Filter By
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                aria-label="Filter notes"
              >
                <option value="all">All Notes</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>
          </div>
          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-blue-700">
            <div className="text-sm text-gray-200">
              Showing {filteredNotes.length} of {allNotes.length} notes
            </div>
            <button
              onClick={() => filterAndSortNotes()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 ml-4"
              aria-label="Search notes"
            >
              <FontAwesomeIcon icon={faSearch} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-7xl mb-6">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <h3 className="text-3xl font-poppins font-semibold text-gray-700 mb-4">
              {searchQuery ? "No notes found" : "No notes available"}
            </h3>
            <p className="text-gray-500 mb-8 text-xl">
              {searchQuery
                ? `Try adjusting your search terms or filters`
                : "Start by creating some notes or browse available ones"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-semibold"
                aria-label="Clear search"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredNotes.map((note, index) => (
              <div
                key={note.public_id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transform transition hover:-translate-y-2 animate-slide-in-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex-1">
                      <h3 className="text-2xl font-poppins font-semibold text-gray-900 mb-3 line-clamp-2">
                        {note.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-lg">
                        {note.description}
                      </p>
                    </div>

                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                        note.is_public
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {note.is_public ? "Public" : "Private"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-base text-gray-500 mb-5">
                    <span>By {note.owner?.username}</span>
                    <span>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/note/${note.public_id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-poppins font-semibold text-lg"
                      aria-label="View note details"
                    >
                      View Details
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>

                    <div className="flex items-center space-x-5 text-sm text-gray-400">
                      <span>
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Note
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;