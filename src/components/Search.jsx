import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getPublicNotes } from "../services/notesService.js";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'title'
  const [filterBy, setFilterBy] = useState("all"); // 'all', 'public', 'private'

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [allNotes, searchQuery, sortBy, filterBy]);

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
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setFilterBy("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-2xl font-poppins font-bold text-blue-600"
              >
                NoteLens
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/courses"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Courses
                </Link>
                <span className="text-blue-600 font-semibold">Search</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.username || "User"}!
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-4 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            Search Notes
          </h1>
          <p className="text-gray-600">Find notes using search and filters</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, description, or username..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            {/* Filter By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter By
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notes</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {filteredNotes.length} of {allNotes.length} notes
            </div>

            {(searchQuery || sortBy !== "newest" || filterBy !== "all") && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "No notes found" : "No notes available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `Try adjusting your search terms or filters`
                : "Start by creating some notes or browse available ones"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.public_id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {note.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-3">
                        {note.description}
                      </p>
                    </div>

                    <span
                      className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${
                        note.is_public
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {note.is_public ? "Public" : "Private"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>By {note.owner?.username}</span>
                    <span>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/note/${note.public_id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      View Details
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>📝 Note</span>
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
