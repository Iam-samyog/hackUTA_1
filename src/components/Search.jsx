import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { searchNotes } from "../services/searchService.js";
import { getPopularTags } from "../services/tagsService.js";
import { toggleBookmark } from "../services/bookmarksService.js";
import NavbarNew from "./NavbarNew.jsx";
import {
  triggerFileDownload,
  getMarkdownContent,
  getOCRStatus,
} from "../services/notesService.js";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination.jsx";
import { TagList, TagInput } from "./TagComponents.jsx";
import {
  OCRStatusBadge,
  OCRProgressIndicator,
  OCRErrorMessage,
  OCRFeatureHighlight,
} from "./OCRComponents.jsx";
import MarkdownViewer from "./MarkdownViewer.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faSearch,
  faFilter,
  faTimesCircle,
  faHeart,
  faEye,
  faDownload,
  faSignOutAlt,
  faArrowRight,
  faFileAlt,
  faFileText,
  faFilePdf,
  faPlus,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search results and pagination
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // still used for sidebar
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);

  // Search form state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Data
  const [popularTags, setPopularTags] = useState([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState(new Set());
  const [allNotes, setAllNotes] = useState([]);

  // Markdown viewer state
  const [showMarkdownViewer, setShowMarkdownViewer] = useState(false);
  const [currentMarkdownNote, setCurrentMarkdownNote] = useState(null);

  useEffect(() => {
    fetchPopularTags();

    // Initialize search from URL params
    const initialQuery = searchParams.get("q") || "";
    const initialTags = searchParams.get("tags") || "";

    if (initialQuery) setSearchQuery(initialQuery);
    if (initialTags) {
      setSelectedTags(initialTags.split(",").map((tag) => ({ name: tag })));
    }

    // Perform initial search if there are params, otherwise load all public notes
    if (initialQuery || initialTags) {
      performSearch({
        q: initialQuery,
        tags: initialTags,
      });
    } else {
      // Load all public notes initially
      performSearch({});
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      searchQuery ||
      selectedTags.length > 0 ||
      courseFilter ||
      ownerFilter ||
      visibilityFilter
    ) {
      performSearch();
    }
  }, [currentPage, perPage]);

  const fetchPopularTags = async () => {
    try {
      const tags = await getPopularTags(20);
      setPopularTags(tags);
    } catch (error) {
      console.error("Error fetching popular tags:", error);
    }
  };

  const performSearch = async (customParams = {}) => {
    try {
      setLoading(true);
      setError("");

      const searchParams = {
        page: currentPage,
        per_page: perPage,
        ...customParams,
      };

      // Add current form values if not overridden by customParams
      if (!customParams.q && searchQuery) searchParams.q = searchQuery;
      if (!customParams.tags && selectedTags.length > 0) {
        searchParams.tags = selectedTags
          .map((tag) => tag.name || tag)
          .join(",");
      }
      if (!customParams.course && courseFilter)
        searchParams.course = courseFilter;
      if (!customParams.owner && ownerFilter) searchParams.owner = ownerFilter;
      if (!customParams.is_public && visibilityFilter) {
        searchParams.is_public = visibilityFilter === "public";
      }

      const results = await searchNotes(searchParams);
      console.log("Search API called with params:", searchParams);
      console.log("Search results received:", results);

      // Handle both old format (array) and new format (pagination object)
      if (Array.isArray(results)) {
        console.log("Results in array format, count:", results.length);
        setSearchResults(results);
        setTotalResults(results.length);
        setTotalPages(1);
        setHasNext(false);
        setHasPrev(false);
      } else {
        console.log(
          "Results in pagination format, items count:",
          results.items?.length || 0
        );
        setSearchResults(results.items || []);
        setTotalResults(results.total || 0);
        setTotalPages(results.pages || 0);
        setHasNext(results.has_next || false);
        setHasPrev(results.has_prev || false);
      }
    } catch (error) {
      setError("Failed to search notes");
      console.error("Error searching notes:", error);
      // Set empty results as fallback
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(0);
      setHasNext(false);
      setHasPrev(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch();
  };

  const handleBookmarkToggle = async (notePublicId) => {
    try {
      await toggleBookmark(notePublicId);
      const newBookmarked = new Set(bookmarkedNotes);
      if (newBookmarked.has(notePublicId)) {
        newBookmarked.delete(notePublicId);
      } else {
        newBookmarked.add(notePublicId);
      }
      setBookmarkedNotes(newBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setCourseFilter("");
    setOwnerFilter("");
    setVisibilityFilter("");
    setSearchResults([]);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    const tagName = tag.name || tag;
    if (!selectedTags.some((t) => (t.name || t) === tagName)) {
      setSelectedTags([...selectedTags, { name: tagName }]);
      setCurrentPage(1);
      // Trigger search after state updates
      setTimeout(() => performSearch(), 0);
    }
  };

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
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  // Handle clicking on username to view profile
  const handleUsernameClick = (username) => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  // File download handler
  const handleFileDownload = async (noteId, filename) => {
    try {
      await triggerFileDownload(noteId, "original");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  // Markdown download handler
  const handleMarkdownDownload = async (noteId, filename) => {
    try {
      await triggerFileDownload(noteId, "markdown");
    } catch (error) {
      console.error("Markdown download failed:", error);
      alert("Markdown download failed. Please try again.");
    }
  };

  // Open markdown viewer
  const handleViewMarkdown = (note) => {
    setCurrentMarkdownNote(note);
    setShowMarkdownViewer(true);
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

      {/* NavbarNew Replacement */}
      <NavbarNew
        user={user}
        logout={logout}
        setShowCreateModal={setShowCreateModal}
        showDebugger={showDebugger}
        setShowDebugger={setShowDebugger}
      />

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
        <div
          className={`bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl shadow-xl p-8 mb-12 border border-blue-700 ${
            isSearchBoxVisible ? "animate-fade-in-slide-up" : ""
          }`}
        >
          <form onSubmit={handleSearch}>
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch(e);
                      }
                    }}
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
                Showing {searchResults.length} of {totalResults} notes
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 ml-4"
                aria-label="Search notes"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searchResults.length === 0 ? (
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
            {searchResults.map((note, index) => (
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
                    <button
                      onClick={() => handleUsernameClick(note.owner?.username)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
                      title={`View ${note.owner?.username}'s profile`}
                    >
                      By {note.owner?.username}
                    </button>
                    <span>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* OCR Status Display */}
                  <div className="mb-4">
                    <OCRStatusBadge noteId={note.public_id} />
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <Link
                      to={`/note/${note.public_id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-poppins font-semibold text-lg"
                      aria-label="View note details"
                    >
                      View Details
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>

                    <div className="flex items-center space-x-3">
                      {/* Markdown View Button */}
                      <button
                        onClick={() => handleViewMarkdown(note)}
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors font-poppins font-semibold"
                        title="View AI-generated markdown"
                      >
                        <FontAwesomeIcon icon={faFileText} className="mr-1" />
                        Markdown
                      </button>

                      {/* Download Options */}
                      <div className="relative group">
                        <button className="inline-flex items-center text-gray-600 hover:text-gray-700 transition-colors font-poppins font-semibold">
                          <FontAwesomeIcon icon={faDownload} className="mr-1" />
                          Download
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-10">
                          <button
                            onClick={() =>
                              handleFileDownload(
                                note.public_id,
                                `${note.title}.pdf`
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FontAwesomeIcon
                              icon={faFilePdf}
                              className="mr-2"
                            />
                            Original File
                          </button>
                          <button
                            onClick={() =>
                              handleMarkdownDownload(
                                note.public_id,
                                `${note.title}.md`
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FontAwesomeIcon
                              icon={faFileText}
                              className="mr-2"
                            />
                            Markdown
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-5 text-sm text-gray-400">
                      <span>
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />{" "}
                        Note
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Markdown Viewer Modal */}
      {showMarkdownViewer && currentMarkdownNote && (
        <MarkdownViewer
          note={currentMarkdownNote}
          onClose={() => setShowMarkdownViewer(false)}
        />
      )}
    </div>
  );
};

export default Search;
