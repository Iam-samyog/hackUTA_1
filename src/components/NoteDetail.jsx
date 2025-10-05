import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NavbarNew from "./NavbarNew.jsx";
import MarkdownViewer from "./MarkdownViewer.jsx";

import {
  getNoteById,
  getNoteComments,
  addComment,
  getNoteReactions,
  toggleReaction,
  getNoteCollaborators,
  addCollaborator,
  deleteNote,
  getMarkdownContent,
} from "../services/notesService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faSignOutAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer.jsx";

const NoteDetail = () => {
  const { publicId } = useParams();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [collaboratorLoading, setCollaboratorLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);
  const [showMarkdownViewer, setShowMarkdownViewer] = useState(false);

  useEffect(() => {
    fetchNoteData();
  }, [publicId]);

  const fetchNoteData = async () => {
    try {
      setLoading(true);
      const [noteData, commentsData, reactionsData, collaboratorsData] =
        await Promise.all([
          getNoteById(publicId),
          getNoteComments(publicId),
          getNoteReactions(publicId),
          getNoteCollaborators(publicId),
        ]);
      setNote(noteData);
      setComments(commentsData);
      setReactions(reactionsData);
      setCollaborators(collaboratorsData);
    } catch (error) {
      setError("Failed to fetch note data");
      console.error("Error fetching note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Check if user is authenticated before attempting
    if (!user || !isAuthenticated) {
      setError(
        "You must be logged in to add comments. Please log in and try again."
      );
      return;
    }

    try {
      setCommentLoading(true);
      const result = await addComment(publicId, newComment);
      setNewComment("");
      const commentsData = await getNoteComments(publicId);
      setComments(commentsData);
    } catch (error) {
      console.error("Comment error details:", error);

      // Handle specific authentication errors
      if (
        error.message.includes("Authentication required") ||
        error.message.includes("session has expired")
      ) {
        setError(`${error.message} Please refresh the page and log in again.`);
      } else {
        setError(`Failed to add comment: ${error.message}`);
      }
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    // Check if user is authenticated before attempting
    if (!user || !isAuthenticated) {
      setError(
        "You must be logged in to react to notes. Please log in and try again."
      );
      return;
    }

    try {
      await toggleReaction(publicId, reactionType);
      const reactionsData = await getNoteReactions(publicId);
      setReactions(reactionsData);
    } catch (error) {
      console.error("Reaction error details:", error);

      // Handle specific authentication errors
      if (
        error.message.includes("Authentication required") ||
        error.message.includes("session has expired")
      ) {
        setError(`${error.message} Please refresh the page and log in again.`);
      } else {
        setError(`Failed to update reaction: ${error.message}`);
      }
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!newCollaborator.trim()) return;
    try {
      setCollaboratorLoading(true);
      await addCollaborator(publicId, newCollaborator);
      setNewCollaborator("");
      const collaboratorsData = await getNoteCollaborators(publicId);
      setCollaborators(collaboratorsData);
    } catch (error) {
      setError("Failed to add collaborator");
      console.error("Error adding collaborator:", error);
    } finally {
      setCollaboratorLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await deleteNote(publicId);
      navigate("/dashboard");
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

  const handleViewMarkdown = () => {
    // For now, always allow trying to view markdown - let the MarkdownViewer handle errors
    // if (!note?.has_markdown) {
    //   alert(
    //     "AI-generated markdown content is not available for this note yet. The AI processing may still be in progress. Please try again later."
    //   );
    //   return;
    // }
    setShowMarkdownViewer(true);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-blue-600 font-medium">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 transition-all hover:scale-105 hover:z-10">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all hover:scale-105 hover:z-10">
            <i className="fas fa-file-alt text-4xl text-blue-500"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Note not found
          </h2>
          <p className="text-gray-500 mb-6">
            The note you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:z-10"
          >
            <i className="fas fa-arrow-left mr-2 text-blue-500"></i> Back to
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 animate-fadeIn">
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
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
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <span className="text-2xl font-poppins font-bold text-blue-900">
              NoteLens
            </span>
            <button onClick={toggleMenu}>
              <FontAwesomeIcon
                icon={faTimes}
                size="lg"
                className="text-black"
              />
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

        <main className="max-w-7xl mt-5 mx-auto px-2 sm:px-4 lg:px-8 py-4">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start animate-pulse">
              <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3 mt-0.5"></i>
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                <i className="fas fa-times text-blue-500"></i>
              </button>
            </div>
          )}

          {(!user || !isAuthenticated) && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-start">
              <i className="fas fa-info-circle text-blue-500 text-xl mr-3 mt-0.5"></i>
              <div className="flex-1">
                <p className="text-blue-700 font-medium">
                  <Link to="/login" className="underline hover:text-blue-900">
                    Log in
                  </Link>{" "}
                  to interact with this note by adding comments and reactions.
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-blue-100 hover:border-blue-500 transition-all hover:scale-105 hover:z-10">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <div className="flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
                    <img
                      src={
                        note.thumbnail || "https://via.placeholder.com/148x210"
                      }
                      alt="Note Thumbnail"
                      className="w-32 h-44 sm:w-[148px] sm:h-[210px] object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 md:mb-6 gap-2">
                      <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 md:mb-3">
                          {note.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 md:space-x-4 text-xs sm:text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                              <i className="fas fa-user text-white text-xs"></i>
                            </div>
                            <span className="font-medium">
                              {note.owner?.username}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <i className="far fa-calendar text-blue-500"></i>
                            <span>
                              {new Date(note.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {user?.username === note.owner?.username && (
                        <button
                          onClick={handleDeleteNote}
                          className="mt-2 md:ml-4 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-2 text-xs sm:text-sm"
                        >
                          <i className="fas fa-trash-alt text-blue-500"></i>
                          <span className="font-medium">Delete</span>
                        </button>
                      )}
                    </div>
                    {note.description && (
                      <div className="mb-4 md:mb-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all hover:scale-105 hover:z-10">
                        <p className="text-gray-700 leading-relaxed">
                          {note.description}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 md:space-x-3 pt-4 md:pt-6 border-t border-blue-100">
                      <button
                        onClick={() => handleReaction("concise")}
                        disabled={!user || !isAuthenticated}
                        className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                          user && isAuthenticated
                            ? "hover:bg-gray-100 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        title={
                          !user || !isAuthenticated
                            ? "Please log in to react"
                            : "Mark as concise"
                        }
                      >
                        <i className="fas fa-compress-alt text-blue-500 text-lg group-hover:scale-125 transition-transform"></i>
                        <span className="font-semibold text-blue-700">
                          {reactions.concise || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => handleReaction("detailed")}
                        disabled={!user || !isAuthenticated}
                        className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                          user && isAuthenticated
                            ? "hover:bg-gray-100 hover:scale-105 hover:z-10 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        title={
                          !user || !isAuthenticated
                            ? "Please log in to react"
                            : "Mark as detailed"
                        }
                      >
                        <i className="fas fa-expand-alt text-blue-500 text-lg group-hover:scale-125 transition-transform"></i>
                        <span className="font-semibold text-green-700">
                          {reactions.detailed || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => handleReaction("readable")}
                        disabled={!user || !isAuthenticated}
                        className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                          user && isAuthenticated
                            ? "hover:bg-gray-100 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        title={
                          !user || !isAuthenticated
                            ? "Please log in to react"
                            : "Mark as readable"
                        }
                      >
                        <i className="fas fa-eye text-blue-500 text-lg group-hover:scale-125 transition-transform"></i>
                        <span className="font-semibold text-purple-700">
                          {reactions.readable || 0}
                        </span>
                      </button>
                      <button
                        onClick={handleViewMarkdown}
                        className="group flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                        title="View AI-generated markdown content"
                      >
                        <i className="fas fa-file-markdown text-lg group-hover:scale-125 transition-transform"></i>
                        <span className="font-semibold">Markdown</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-blue-100 hover:border-blue-500 transition-all hover:scale-105 hover:z-10">
                <div className="flex flex-wrap items-center gap-2 md:space-x-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <i className="fas fa-comments text-white text-lg"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {comments.length}
                  </span>
                </div>
                <form onSubmit={handleAddComment} className="mb-4 md:mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={
                      user && isAuthenticated
                        ? "Share your thoughts..."
                        : "Please log in to add comments..."
                    }
                    rows={3}
                    disabled={!user || !isAuthenticated}
                    className={`w-full px-2 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 sm:mb-3 resize-none text-xs sm:text-sm ${
                      user && isAuthenticated
                        ? "border-blue-200"
                        : "border-gray-300 bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={
                      commentLoading ||
                      !newComment.trim() ||
                      !user ||
                      !isAuthenticated
                    }
                    className="px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-medium text-xs sm:text-sm"
                    title={
                      !user || !isAuthenticated
                        ? "Please log in to add comments"
                        : ""
                    }
                  >
                    {commentLoading ? (
                      <span className="flex items-center space-x-2">
                        <i className="fas fa-spinner fa-spin text-blue-500"></i>
                        <span>Posting...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <i className="fas fa-paper-plane text-blue-500"></i>
                        <span>
                          {user && isAuthenticated
                            ? "Post Comment"
                            : "Login to Comment"}
                        </span>
                      </span>
                    )}
                  </button>
                </form>
                <div className="space-y-2 sm:space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-6 sm:py-12">
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                        <i className="fas fa-comments text-xl sm:text-3xl text-blue-500"></i>
                      </div>
                      <p className="text-gray-400 font-medium text-xs sm:text-base">
                        No comments yet
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Be the first to share your thoughts!
                      </p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-2 sm:p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow hover:scale-105 hover:z-10"
                      >
                        <div className="flex items-start gap-2 sm:space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-user text-white text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">
                                {comment.author?.username}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center space-x-1">
                                <i className="far fa-clock text-blue-500"></i>
                                <span>
                                  {new Date(
                                    comment.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              <div className="bg-blue-800 text-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border border-blue-900 animate-fadeIn">
                <div className="flex flex-wrap items-center gap-2 md:space-x-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <i className="fas fa-users text-blue-500 text-lg"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Collaborators
                  </h3>
                </div>
                {user?.username === note.owner?.username && (
                  <form
                    onSubmit={handleAddCollaborator}
                    className="mb-2 md:mb-4"
                  >
                    <div className="relative mb-2 md:mb-3">
                      <i className="fas fa-user-plus absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"></i>
                      <input
                        type="text"
                        value={newCollaborator}
                        onChange={(e) => setNewCollaborator(e.target.value)}
                        placeholder="Enter username"
                        className="w-full pl-8 pr-2 py-2 sm:pl-10 sm:pr-4 sm:py-3 border-2 border-blue-300 bg-blue-700 text-white placeholder-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={collaboratorLoading || !newCollaborator.trim()}
                      className="w-full px-2 py-2 sm:px-4 sm:py-3 bg-white text-blue-800 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50 shadow-md hover:shadow-lg font-medium text-xs sm:text-sm"
                    >
                      {collaboratorLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <i className="fas fa-spinner fa-spin text-blue-500"></i>
                          <span>Adding...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <i className="fas fa-plus text-blue-500"></i>
                          <span>Add Collaborator</span>
                        </span>
                      )}
                    </button>
                  </form>
                )}
                <div className="space-y-2 sm:space-y-3">
                  {collaborators.length === 0 ? (
                    <div className="text-center py-2 sm:py-4">
                      <i className="fas fa-user-friends text-xl sm:text-3xl text-blue-300 mb-1 sm:mb-2"></i>
                      <p className="text-blue-300 text-xs sm:text-sm">
                        No collaborators yet
                      </p>
                    </div>
                  ) : (
                    collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center gap-2 sm:space-x-3 p-2 sm:p-3 bg-blue-700 rounded-xl hover:bg-blue-900 transition-colors"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-blue-500 text-xs sm:text-base"></i>
                        </div>
                        <span className="text-white font-medium text-xs sm:text-base">
                          {collaborator.username}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-blue-800 text-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border border-blue-900 animate-fadeIn transition-all hover:scale-105 hover:z-10">
                <div className="flex flex-wrap items-center gap-2 md:space-x-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <i className="fas fa-info-circle text-blue-500 text-lg"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white">Information</h3>
                </div>
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-blue-700 rounded-xl">
                    <span className="text-white font-medium flex items-center gap-1 sm:space-x-2 text-xs sm:text-base">
                      <i className="fas fa-eye text-blue-300"></i>
                      <span>Visibility</span>
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:space-x-1 ${
                        note.is_public
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <i
                        className={`fas ${
                          note.is_public ? "fa-globe" : "fa-lock"
                        } text-blue-500 text-xs sm:text-base`}
                      ></i>
                      <span>{note.is_public ? "Public" : "Private"}</span>
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-blue-700 rounded-xl">
                    <span className="text-white font-medium flex items-center gap-1 sm:space-x-2 text-xs sm:text-base">
                      <i className="far fa-calendar-alt text-blue-300"></i>
                      <span>Created</span>
                    </span>
                    <span className="text-white font-medium text-xs sm:text-base">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-blue-700 rounded-xl">
                    <span className="text-white font-medium flex items-center gap-1 sm:space-x-2 text-xs sm:text-base">
                      <i className="fas fa-crown text-blue-300"></i>
                      <span>Owner</span>
                    </span>
                    <span className="text-white font-semibold text-xs sm:text-base">
                      {note.owner?.username}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="mt-12">
        <Footer></Footer>
      </div>

      {/* Markdown Viewer Modal */}
      {showMarkdownViewer && note && (
        <MarkdownViewer
          notePublicId={note.public_id}
          isOpen={showMarkdownViewer}
          onClose={() => setShowMarkdownViewer(false)}
        />
      )}
    </>
  );
};

export default NoteDetail;
