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

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

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
      fetchNotes(); // Refresh list
    } catch (error) {
      setError("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setSelectedFileName(selectedFile.name);
  };

  const handleViewFile = (note) => {
    // In a real app, you would get the file URL from the note
    // For now, we'll simulate this
    setCurrentFile({
      url: `/api/notes/${note.public_id}/file`, // This would be the actual file URL
      name: `${note.title}.pdf`,
    });
    setShowFileViewer(true);
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
            <div className="flex items-center">
              <Link
                to="/"
                className="text-2xl font-poppins font-bold text-blue-600"
              >
                NoteLens
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.username || "User"}!
              </span>
              <Link
                to="/courses"
                className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/search"
                className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Search
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Note
              </button>
              <button
                onClick={() => setShowDebugger(!showDebugger)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Debug API
              </button>
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

        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            Public Notes
          </h1>
          <p className="text-gray-600">
            Discover and share knowledge with the community
          </p>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to share a note with the community!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.public_id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {note.title}
                    </h3>
                    {user?.username === note.owner?.username && (
                      <button
                        onClick={() => handleDeleteNote(note.public_id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete note"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
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

                    <button
                      onClick={() => handleViewFile(note)}
                      className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Note
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-4">
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">API Debugger</h2>
              <button
                onClick={() => setShowDebugger(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
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
