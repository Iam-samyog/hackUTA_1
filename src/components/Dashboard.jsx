import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getPublicNotes,
  createNote,
  deleteNote,
} from "../services/notesService.js";
import { Link, useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload.jsx";
import FileViewer from "./FileViewer.jsx";
import CORSDebugger from "./CORSDebugger.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
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

  // File viewer state
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  // Debug state
  const [showDebugger, setShowDebugger] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const notesData = await getPublicNotes();
      setNotes(notesData);
    } catch (error) {
      setError("Failed to fetch notes");
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
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
      };

      await createNote(noteData);

      // Reset form
      setTitle("");
      setDescription("");
      setIsPublic(true);
      setFile(null);
      setSelectedFileName("");
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

  const handleViewFile = (note) => {
    setCurrentFile({
      url: `/api/notes/${note.public_id}/file`,
      name: `${note.title}.pdf`,
    });
    setShowFileViewer(true);
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
    <div className="min-h-screen bg-gray-50 pt-20">
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
      `}</style>

      {/* Navbar */}
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
            <Link to="/" className="text-xl font-poppins font-bold text-blue-900">
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
              className="text-black hover:text-blue-600 font-poppins font-semibold transition-colors"
            >
              Search
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-semibold"
            >
              Create Note
            </button>
            <button
              onClick={() => setShowDebugger(!showDebugger)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-poppins font-semibold"
            >
              Debug API
            </button>
            <span className="text-gray-600 text-sm">
              Welcome, {user?.username || "User"}!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-poppins font-semibold"
            >
              Logout
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
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-semibold"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div
                key={note.public_id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 transform transition hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-poppins font-semibold text-gray-900 line-clamp-2">
                      {note.title}
                    </h3>
                    {user?.username === note.owner?.username && (
                      <button
                        onClick={() => handleDeleteNote(note.public_id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete note"
                        aria-label="Delete note"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3 text-base">
                    {note.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {note.owner?.username}</span>
                    <span>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/note/${note.public_id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-poppins font-semibold"
                    >
                      View Details
                      <i className="fas fa-arrow-right ml-1"></i>
                    </Link>

                    <button
                      onClick={() => handleViewFile(note)}
                      className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors font-poppins font-semibold"
                      aria-label="View file"
                    >
                      <i className="fas fa-eye mr-1"></i>
                      View File
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <h2 className="text-xl font-poppins font-semibold">API Debugger</h2>
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
    </div>
  );
};

export default Dashboard;