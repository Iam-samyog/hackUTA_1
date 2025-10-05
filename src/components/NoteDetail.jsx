import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getNoteById,
  getNoteComments,
  addComment,
  getNoteReactions,
  toggleReaction,
  getNoteCollaborators,
  addCollaborator,
} from "../services/notesService.js";

const NoteDetail = () => {
  const { publicId } = useParams();
  const { user, logout } = useAuth();
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

    try {
      setCommentLoading(true);
      await addComment(publicId, newComment);
      setNewComment("");

      // Refresh comments
      const commentsData = await getNoteComments(publicId);
      setComments(commentsData);
    } catch (error) {
      setError("Failed to add comment");
      console.error("Error adding comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    try {
      await toggleReaction(publicId, reactionType);

      // Refresh reactions
      const reactionsData = await getNoteReactions(publicId);
      setReactions(reactionsData);
    } catch (error) {
      setError("Failed to update reaction");
      console.error("Error updating reaction:", error);
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!newCollaborator.trim()) return;

    try {
      setCollaboratorLoading(true);
      await addCollaborator(publicId, newCollaborator);
      setNewCollaborator("");

      // Refresh collaborators
      const collaboratorsData = await getNoteCollaborators(publicId);
      setCollaborators(collaboratorsData);
    } catch (error) {
      setError("Failed to add collaborator");
      console.error("Error adding collaborator:", error);
    } finally {
      setCollaboratorLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Note not found
          </h2>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
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
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-2xl font-poppins font-bold text-blue-600"
              >
                NoteLens
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-800"
              >
                Dashboard
              </Link>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Note Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-4">
                {note.title}
              </h1>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>By {note.owner?.username}</span>
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
              </div>

              {note.description && (
                <p className="text-gray-700 mb-6">{note.description}</p>
              )}

              {/* Reactions */}
              <div className="flex items-center space-x-4 border-t pt-4">
                <button
                  onClick={() => handleReaction("like")}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <span>👍</span>
                  <span>{reactions.like || 0}</span>
                </button>
                <button
                  onClick={() => handleReaction("love")}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <span>❤️</span>
                  <span>{reactions.love || 0}</span>
                </button>
                <button
                  onClick={() => handleReaction("helpful")}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <span>💡</span>
                  <span>{reactions.helpful || 0}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <button
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {commentLoading ? "Adding..." : "Add Comment"}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-200 pb-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.author?.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collaborators */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Collaborators
              </h3>

              {/* Add Collaborator Form (only for note owner) */}
              {user?.username === note.owner?.username && (
                <form onSubmit={handleAddCollaborator} className="mb-4">
                  <input
                    type="text"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                    placeholder="Username to add"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <button
                    type="submit"
                    disabled={collaboratorLoading || !newCollaborator.trim()}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {collaboratorLoading ? "Adding..." : "Add Collaborator"}
                  </button>
                </form>
              )}

              {/* Collaborators List */}
              <div className="space-y-2">
                {collaborators.length === 0 ? (
                  <p className="text-gray-500 text-sm">No collaborators yet</p>
                ) : (
                  collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {collaborator.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700">
                        {collaborator.username}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Note Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Note Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Visibility:</span>
                  <span className="text-gray-700">
                    {note.is_public ? "Public" : "Private"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-700">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner:</span>
                  <span className="text-gray-700">{note.owner?.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoteDetail;
