import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import NavbarNew from "./NavbarNew.jsx";
import {
  getPublicNotes,
  createNote,
  deleteNote,
  triggerFileDownload,
} from "../services/notesService.js";
import { getPopularTags } from "../services/tagsService.js";
import { toggleBookmark } from "../services/bookmarksService.js";
import { getRecommendedNotes } from "../services/searchService.js";
import { Link, useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload.jsx";
import FileViewer from "./FileViewer.jsx";
import CORSDebugger from "./CORSDebugger.jsx";
import Pagination from "./Pagination.jsx";
import { TagList, TagInput } from "./TagComponents.jsx";
import MarkdownViewer from "./MarkdownViewer.jsx";
import {
  OCRStatusBadge,
  OCRProgressIndicator,
  OCRFeatureHighlight,
} from "./OCRComponents.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faHeart,
  faEye,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  // Notes and pagination state
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form state for creating notes
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // New features state
  const [popularTags, setPopularTags] = useState([]);
  const [recommendedNotes, setRecommendedNotes] = useState([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'recommended'

  // File viewer state
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  // Markdown viewer state
  const [showMarkdownViewer, setShowMarkdownViewer] = useState(false);
  const [currentMarkdownNote, setCurrentMarkdownNote] = useState(null);

  // Debug state
  const [showDebugger, setShowDebugger] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
    fetchPopularTags();
    if (user) {
      fetchRecommendedNotes().catch((error) => {
        console.warn(
          "Failed to fetch recommended notes, continuing without recommendations:",
          error
        );
      });
    }
  }, [currentPage, perPage, activeTab, user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let notesData;

      if (activeTab === "recommended" && user) {
        notesData = await getRecommendedNotes(currentPage, perPage);
      } else {
        notesData = await getPublicNotes(currentPage, perPage);
      }

      // Handle both old format (array) and new format (pagination object)
      if (Array.isArray(notesData)) {
        setNotes(notesData);
        setTotalNotes(notesData.length);
        setTotalPages(1);
        setHasNext(false);
        setHasPrev(false);
      } else {
        setNotes(notesData.items || []);
        setTotalNotes(notesData.total || 0);
        setTotalPages(notesData.pages || 0);
        setHasNext(notesData.has_next || false);
        setHasPrev(notesData.has_prev || false);
      }
    } catch (error) {
      setError("Failed to fetch notes");
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const tags = await getPopularTags(10);
      setPopularTags(tags);
    } catch (error) {
      console.error("Error fetching popular tags:", error);
    }
  };

  const fetchRecommendedNotes = async () => {
    try {
      const recommended = await getRecommendedNotes(1, 6);
      setRecommendedNotes(recommended.items || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Set empty array as fallback to prevent UI errors
      setRecommendedNotes([]);
    }
  };

  const handleBookmarkToggle = async (notePublicId) => {
    try {
      await toggleBookmark(notePublicId);
      // Update local state
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
    setCurrentPage(1); // Reset to first page
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreateLoading(true);
      const noteData = {
        title,
        description,
        is_public: isPublic,
        file,
        tags: selectedTags, // Include tags in note creation
      };

      await createNote(noteData);

      // Reset form
      setTitle("");
      setDescription("");
      setIsPublic(true);
      setFile(null);
      setSelectedFileName("");
      setSelectedTags([]);
      setShowCreateModal(false);

      // Refresh notes list
      fetchNotes();
    } catch (error) {
      setError("Failed to create note");
      console.error("Error creating note:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteNote = async (publicId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(publicId);
      fetchNotes();
    } catch (error) {
      setError("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSelectedFileName(selectedFile.name);
  };

  // Handle clicking on username to view profile
  const handleUsernameClick = (username) => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  const handleViewFile = (note) => {
    setCurrentFile({
      url: `/api/notes/${note.public_id}/file`,
      name: `${note.title}.pdf`,
    });
    setShowFileViewer(true);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 mt-5">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
          }
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
        }

        .card-glow:hover {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Navbar */}
      <NavbarNew
        user={user}
        logout={logout}
        setShowCreateModal={setShowCreateModal}
        showDebugger={showDebugger}
        setShowDebugger={setShowDebugger}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-xl font-poppins font-bold text-blue-900">
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
            className="text-gray-700 hover:text-blue-600 font-poppins font-semibold text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Search
          </Link>
          <button
            onClick={() => {
              setShowCreateModal(true);
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white font-poppins font-semibold rounded-lg hover:bg-blue-700 transition-all text-left"
          >
            Create Note
          </button>
          <button
            onClick={() => {
              setShowDebugger(!showDebugger);
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-red-600 text-white font-poppins font-semibold rounded-lg hover:bg-red-700 transition-all text-left"
          >
            Debug API
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-poppins font-semibold rounded-lg hover:bg-gray-300 transition-all text-left"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-4 text-sm underline hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Popular Tags
            </h2>
            <TagList
              tags={popularTags}
              onTagClick={(tag) => navigate(`/search?tags=${tag.name}`)}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange("all")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Notes ({totalNotes})
            </button>
            {user && (
              <button
                onClick={() => handleTabChange("recommended")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "recommended"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Recommended
                {recommendedNotes.length > 0 && ` (${recommendedNotes.length})`}
              </button>
            )}
          </nav>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-2">
            Public Notes
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and share knowledge with the community
          </p>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-file-alt"></i>
            </div>
            <h3 className="text-2xl font-poppins font-semibold text-gray-700 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-500 mb-6 text-lg">
              Be the first to share a note with the community!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-200 text-blue-900 w-[600px] h-[300px] rounded-full shadow-2xl hover:bg-blue-300 transition-all font-poppins font-extrabold text-6xl tracking-widest border-4 border-blue-300 flex items-center justify-center mx-auto"
            >
              <i className="fas fa-plus mr-12 text-6xl"></i>
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div
                key={note.public_id}
                className="bg-gray-400  border  transform transition hover:scale-[1.02] card-glow relative overflow-hidden rounded-xl w-[340px]  mx-auto"
              >
                <div className="p-0 border border-[5px] border-blue-500">
                  <div className="relative h-32 w-full flex  items-center justify-center bg-gray-100">
                    <div className="absolute top-3 right-3 z-20">
                      {user?.username === note.owner?.username && (
                        <button
                          onClick={() => handleDeleteNote(note.public_id)}
                          className="text-blue-300 hover:text-white transition-colors bg-blue-900/50 rounded-full p-2 shadow-md backdrop-blur-sm"
                          title="Delete note"
                          aria-label="Delete note"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col items-center  justify-center w-full px-6">
                      <h3 className="text-xl font-poppins font-bold text-black drop-shadow-lg mb-1 text-center line-clamp-2">
                        {note.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 ${note.is_public ? 'bg-blue-600 text-blue-200' : 'bg-gray-700 text-gray-300'}`}>
                        {note.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-5 flex flex-col gap-3 bg-[#6E8FE2]">
                    <p className="text-blue-200 mb-2 line-clamp-2 text-sm text-center font-inter">
                      {note.description}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-white mb-2">
                      <button
                        onClick={() => handleUsernameClick(note.owner?.username)}
                        className="flex items-center gap-1 hover:underline"
                        title={`View ${note.owner?.username}'s profile`}
                      >
                        <i className="fas fa-user"></i> {note.owner?.username}
                      </button>
                      <span className="flex items-center gap-1">
                        <i className="far fa-calendar-alt"></i> {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <OCRStatusBadge noteId={note.public_id} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Link
                        to={`/note/${note.public_id}`}
                        className="inline-flex items-center justify-center px-3 py-2 bg-white text-black hover:text-white rounded-lg hover:bg-blue-500 hover:border-b transition-colors font-poppins font-semibold shadow-md hover:shadow-lg text-xs"
                      >
                        <i className="fas fa-eye mr-1"></i> Details
                      </Link>
                      <button
                        onClick={() => handleViewFile(note)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-white text-black hover:text-white rounded-lg hover:bg-blue-500 hover:border-b transition-colors font-poppins font-semibold shadow-md hover:shadow-lg text-xs"
                        aria-label="View file"
                      >
                        <i className="fas fa-file-pdf mr-1"></i> View PDF
                      </button>
                      <button
                        onClick={() => handleViewMarkdown(note)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-white text-black hover:text-white rounded-lg hover:bg-blue-500 hover:border-b transition-colors font-poppins font-semibold shadow-md hover:shadow-lg text-xs"
                        title="View AI-generated markdown"
                      >
                        <i className="fas fa-file-markdown mr-1"></i> Markdown
                      </button>
                      <button
                        onClick={() => handleFileDownload(note.public_id, `${note.title}.pdf`)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-white text-black hover:text-white rounded-lg hover:bg-blue-500 hover:border-b transition-colors font-poppins font-semibold shadow-md hover:shadow-lg text-xs"
                      >
                        <i className="fas fa-download mr-1"></i> PDF
                      </button>
                      <button
                        onClick={() => handleMarkdownDownload(note.public_id, `${note.title}.md`)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-white text-black rounded-lg hover:bg-blue-500 hover:text-white transition-colors font-poppins font-semibold shadow-md hover:shadow-lg text-xs col-span-2"
                      >
                        <i className="fas fa-download mr-1"></i> Download Markdown
                      </button>
                    </div>
                  </div>
                </div>
               
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && notes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            perPage={perPage}
            total={totalNotes}
          />
        )}
      </main>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg animate-slide-in">
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-poppins font-bold text-gray-900">
                  Create New Note
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <TagInput
                    tags={selectedTags}
                    onTagsChange={setSelectedTags}
                    suggestions={popularTags}
                    placeholder="Add tags to help others find your note..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF File *
                  </label>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    accept=".pdf"
                    maxSize={10}
                  />
                  {selectedFileName && (
                    <div className="mt-2 text-sm text-green-600">
                      Selected: {selectedFileName}
                    </div>
                  )}
                </div>

                {/* OCR Feature Highlight */}
                <OCRFeatureHighlight />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this note public
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors font-poppins font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 font-poppins font-semibold"
                  >
                    {createLoading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {showFileViewer && currentFile && (
        <FileViewer
          fileUrl={currentFile.url}
          fileName={currentFile.name}
          onClose={() => setShowFileViewer(false)}
        />
      )}

      {/* CORS Debugger */}
      {showDebugger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto shadow-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-poppins font-semibold">
                API Debugger
              </h2>
              <button
                onClick={() => setShowDebugger(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close debugger"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4">
              <CORSDebugger />
            </div>
          </div>
        </div>
      )}

      {/* Markdown Viewer Modal */}
      {showMarkdownViewer && currentMarkdownNote && (
        <MarkdownViewer
          note={currentMarkdownNote}
          onClose={() => setShowMarkdownViewer(false)}
        />
      )}

      {/* Floating Create Note Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-40 group"
        aria-label="Create new note"
      >
        <i className="fas fa-plus text-2xl"></i>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-blue-900 text-white px-3 py-2 rounded-lg text-sm font-poppins font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Create Note
        </span>
      </button>
    </div>
  );
};

export default Dashboard;