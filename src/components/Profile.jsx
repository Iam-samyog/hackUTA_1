import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  FileText,
  UserPlus,
  Search,
  Bell,
  Home,
  MessageCircle,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faTimes,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserProfile,
  updateUserProfile,
  getRecommendedUsers,
  followUser,
  unfollowUser,
} from "../services/userService.js";
import { searchNotes } from "../services/searchService.js";
import { getUserStats } from "../services/statsService.js";
import { getMyCourses } from "../services/courseService.js";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FileUpload = ({ onFileSelect, accept, maxSize }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSizeAlert, setShowSizeAlert] = useState(false);

  // States and refs for webcam functionality
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Simple check for mobile devices
  const isMobile =
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        setShowSizeAlert(true);
      } else {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        setShowSizeAlert(true);
      } else {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleCameraButtonClick = () => {
    if (isMobile) {
      if (cameraInputRef.current) cameraInputRef.current.click();
    } else {
      // Desktop: open webcam modal
      setShowWebcamModal(true);
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setWebcamStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          alert("Unable to access webcam. Please check permissions.");
        });
    }
  };

  const handleWebcamCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "webcam-capture.jpg", {
            type: "image/jpeg",
          });
          setSelectedFile(file);
          onFileSelect(file);
          setShowWebcamModal(false);
          if (webcamStream) {
            webcamStream.getTracks().forEach((track) => track.stop());
            setWebcamStream(null);
          }
        }
      }, "image/jpeg");
    }
  };

  const handleWebcamModalClose = () => {
    setShowWebcamModal(false);
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > maxSize * 1024 * 1024) {
        setShowSizeAlert(true);
      } else {
        setSelectedFile(file);
        onFileSelect(file);
      }
    } else if (file) {
      alert("Please capture an image.");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <p className="text-gray-600 mb-2">Drag and drop a file here, or</p>
        <div className="flex gap-4 justify-center">
          <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faFilePdf} />
            Add File
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleChange}
            />
          </label>
          <button
            type="button"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 flex items-center gap-2"
            onClick={handleCameraButtonClick}
          >
            <FontAwesomeIcon icon={faCamera} />
            Camera
          </button>
          <input
            type="file"
            accept="image/*"
            capture="environment" // Prioritize back camera on mobile
            className="hidden"
            ref={cameraInputRef}
            onChange={handleCameraCapture}
          />
        </div>
      </div>
      {selectedFile && (
        <div className="mt-2 text-sm text-green-600 flex items-center">
          Selected: {selectedFile.name}
          <button
            onClick={removeFile}
            className="ml-2 text-red-600 hover:text-red-800 transition-colors"
            aria-label="Remove file"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      {showSizeAlert && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[9998]"></div>
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                File Size Exceeded
              </h3>
              <p className="text-gray-600 mb-6">
                Please select a file smaller than {maxSize}MB.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSizeAlert(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Webcam Modal for Desktop */}
      {showWebcamModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-lg h-auto bg-black rounded"
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleWebcamCapture}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
              >
                Capture
              </button>
              <button
                onClick={handleWebcamModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { username } = useParams(); // Get username from URL params

  // States for profile data (moved up to avoid initialization issues)
  const [profileUser, setProfileUser] = useState(null);
  const [profileNotes, setProfileNotes] = useState([]);
  const [profileStats, setProfileStats] = useState(null);
  const [profileCourses, setProfileCourses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // UI states
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [likedNotes, setLikedNotes] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  // Check if this is the current user's profile
  // Need to check multiple sources since user context might not be loaded yet
  const getCurrentUsername = () => {
    // Try context first
    if (user?.username) return user.username;

    // Try localStorage
    try {
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.username) return userData.username;
      }
    } catch (e) {
      console.warn("Failed to parse stored user data:", e);
    }

    return null;
  };

  const currentUsername = getCurrentUsername();
  const [isOwnProfile, setIsOwnProfile] = useState(
    !username || username === currentUsername
  );

  // Re-evaluate isOwnProfile when user data changes
  useEffect(() => {
    const newCurrentUsername = getCurrentUsername();
    const newIsOwnProfile = !username || username === newCurrentUsername;
    if (newIsOwnProfile !== isOwnProfile) {
      console.log(
        "isOwnProfile updated:",
        newIsOwnProfile,
        "Username:",
        username,
        "Current:",
        newCurrentUsername
      );
      setIsOwnProfile(newIsOwnProfile);
    }
  }, [user, profileUser, username]);

  // Re-evaluate when stats data updates the stored user
  useEffect(() => {
    const handleStorageChange = () => {
      const newCurrentUsername = getCurrentUsername();
      const newIsOwnProfile = !username || username === newCurrentUsername;
      if (newIsOwnProfile !== isOwnProfile) {
        console.log("isOwnProfile updated from storage:", newIsOwnProfile);
        setIsOwnProfile(newIsOwnProfile);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [username, isOwnProfile]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isOwnProfile) {
          // For own profile, use context user data as primary source
          console.log("Loading own profile...");

          // Use user from context immediately
          const contextUser = user;
          console.log("Context user:", contextUser);

          if (contextUser) {
            setProfileUser(contextUser);
          } else {
            // Fallback to localStorage
            const storedUser = localStorage.getItem("user_data");
            const authToken = localStorage.getItem("auth_token");

            console.log("Checking localStorage:", {
              hasStoredUser: !!storedUser,
              hasAuthToken: !!authToken,
            });

            if (storedUser) {
              try {
                const parsedUser = JSON.parse(storedUser);
                console.log("Using stored user data:", parsedUser);
                setProfileUser(parsedUser);
              } catch (parseError) {
                console.error("Failed to parse stored user data:", parseError);
              }
            } else if (authToken) {
              console.log(
                "Have auth token but no stored user data - will get from API"
              );
              // Will be filled by stats data below
            }
          }

          // Try to fetch additional data, but don't block on failures
          try {
            const [statsData, coursesData, recommendationsData] =
              await Promise.all([
                // Get stats first to know the username
                getUserStats().catch(() => null),
                getMyCourses().catch(() => []),
                getRecommendedUsers(3).catch(() => []),
              ]);

            console.log("Stats data received:", statsData);

            // Now get notes using the username from stats or context
            const usernameForNotes =
              statsData?.username || contextUser?.username || user?.username;
            console.log("Username for notes fetch:", usernameForNotes);

            let actualNotesData = [];
            if (usernameForNotes) {
              try {
                const notesResult = await searchNotes({
                  owner: usernameForNotes,
                });
                console.log("Search API notes result:", notesResult);
                actualNotesData = notesResult?.items || notesResult || [];
              } catch (err) {
                console.warn(
                  "Search API failed, trying getUserNotes fallback:",
                  err
                );
                try {
                  const { getUserNotes } = await import(
                    "../services/notesService.js"
                  );
                  actualNotesData = await getUserNotes().catch(() => []);
                } catch (importErr) {
                  console.warn("Fallback getUserNotes also failed:", importErr);
                }
              }
            }

            console.log(
              "Final notes data:",
              actualNotesData,
              "Length:",
              Array.isArray(actualNotesData)
                ? actualNotesData.length
                : actualNotesData?.items?.length || 0
            );

            // If we don't have profile user data yet, try to use stats data
            if (
              !contextUser &&
              !profileUser &&
              statsData &&
              statsData.username
            ) {
              console.log("Using stats data for profile user:", statsData);
              const userFromStats = {
                username: statsData.username,
                name: statsData.full_name || statsData.username,
                full_name: statsData.full_name,
                id: statsData.user_id,
                // Add any other available fields from stats
                ...statsData,
              };
              setProfileUser(userFromStats);

              // Also try to store this in localStorage for future use
              localStorage.setItem("user_data", JSON.stringify(userFromStats));
              console.log("Stored user data from stats to localStorage");

              // Update isOwnProfile check
              const newIsOwnProfile =
                !username || username === statsData.username;
              if (newIsOwnProfile !== isOwnProfile) {
                console.log(
                  "Updating isOwnProfile based on stats data:",
                  newIsOwnProfile
                );
                setIsOwnProfile(newIsOwnProfile);
              }
            }

            setProfileNotes(
              Array.isArray(actualNotesData)
                ? actualNotesData
                : actualNotesData?.items || []
            );
            setProfileStats(statsData);
            setProfileCourses(
              Array.isArray(coursesData)
                ? coursesData
                : coursesData?.items || []
            );
            setRecommendations(
              Array.isArray(recommendationsData)
                ? recommendationsData
                : recommendationsData?.items || []
            );
          } catch (err) {
            console.warn("Failed to fetch additional profile data:", err);
          }
        } else {
          // For other user's profile
          console.log(`Loading profile for user: ${username}`);

          try {
            const otherUserProfile = await getUserProfile(username);
            console.log("Other user profile:", otherUserProfile);
            setProfileUser(otherUserProfile);

            // Check if current user is already following this user
            if (isAuthenticated && otherUserProfile) {
              // You might want to add a followStatus check here if your API supports it
              // For now, we'll assume not following initially
              setIsFollowing(false);
            }

            // Fetch their notes using search API
            try {
              const notesData = await searchNotes({
                owner: username,
                is_public: true, // Only show public notes for other users
              });
              console.log(`Notes for ${username}:`, notesData);

              setProfileNotes(
                Array.isArray(notesData) ? notesData : notesData?.items || []
              );

              // Try to get their courses if API supports it
              const coursesData = await getMyCourses(username).catch(() => []);
              setProfileCourses(
                Array.isArray(coursesData)
                  ? coursesData
                  : coursesData?.items || []
              );
            } catch (err) {
              console.warn(`Failed to fetch ${username}'s notes:`, err);
              setProfileNotes([]);
              setProfileCourses([]);
            }
          } catch (err) {
            console.error(`Failed to fetch profile for ${username}:`, err);
            setError(`User "${username}" not found`);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, isOwnProfile, user]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Prepare display data - prioritize stats data for username if available
  const displayUser = profileUser || user || {};

  // If we have stats data but no profile user, use stats data for user info
  if (!displayUser.username && profileStats?.username) {
    console.log("Using stats data for display user:", profileStats);
    Object.assign(displayUser, {
      username: profileStats.username,
      name: profileStats.full_name || profileStats.username,
      full_name: profileStats.full_name,
    });
  }

  const userData = {
    name:
      displayUser.full_name ||
      displayUser.name ||
      displayUser.username ||
      profileStats?.username || // Add stats username as backup
      "User",
    username:
      displayUser.username ||
      profileStats?.username ||
      getCurrentUsername() ||
      "user",
    profilePicture:
      displayUser.profile_picture ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    followers: displayUser.followers_count || profileStats?.followers || 0,
    following: displayUser.following_count || profileStats?.following || 0,
    totalPosts:
      displayUser.notes_count ||
      profileStats?.total_notes ||
      profileNotes.length ||
      0,
    bio: displayUser.bio || displayUser.profile_bio || "Welcome to my profile!",
  };

  // Debug logging
  console.log("Profile Component Debug:", {
    isOwnProfile,
    username,
    profileUser,
    userFromContext: user,
    displayUser,
    userData,
    profileNotes: profileNotes.length,
    profileCourses: profileCourses.length,
    isAuthenticated,
    authToken: localStorage.getItem("auth_token") ? "present" : "missing",
    storedUserData: localStorage.getItem("user_data") ? "present" : "missing",
  });

  const availableCourses = [
    { id: 1, name: "Physics", icon: "atom" },
    { id: 2, name: "Mathematics", icon: "calculator" },
    { id: 3, name: "Chemistry", icon: "flask" },
    { id: 4, name: "Computer Science", icon: "laptop-code" },
  ];

  // Fallback data if API calls fail
  const fallbackCourses = [
    {
      id: 1,
      name: "Sample Course",
      institution: "University",
      progress: 0,
    },
  ];

  const fallbackRecommendations = [
    {
      id: 1,
      name: "Welcome User",
      username: "@welcome",
      profilePicture:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      followers: 0,
      bio: "New user",
      mutualFollowers: 0,
    },
  ];

  const toggleLike = (noteId) => {
    setLikedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  const handleFollowToggle = async (targetUsername) => {
    if (!isAuthenticated) {
      alert("Please log in to follow users");
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // Unfollow user
        await unfollowUser(targetUsername);

        // Update local state
        setIsFollowing(false);

        // Update follower count optimistically
        setProfileUser((prev) => ({
          ...prev,
          followers_count: Math.max((prev?.followers_count || 0) - 1, 0),
        }));

        console.log(`Successfully unfollowed ${targetUsername}`);

        // Show success feedback
        const successMsg = document.createElement("div");
        successMsg.innerHTML = `✓ Unfollowed @${targetUsername}`;
        successMsg.className =
          "fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
        document.body.appendChild(successMsg);
        setTimeout(() => document.body.removeChild(successMsg), 3000);
      } else {
        // Follow user
        await followUser(targetUsername);

        // Update local state
        setIsFollowing(true);

        // Update follower count optimistically
        setProfileUser((prev) => ({
          ...prev,
          followers_count: (prev?.followers_count || 0) + 1,
        }));

        // Remove from recommendations if present
        setRecommendations((prev) =>
          prev.filter((user) => user.username !== targetUsername)
        );

        console.log(`Successfully followed ${targetUsername}`);

        // Show success feedback
        const successMsg = document.createElement("div");
        successMsg.innerHTML = `✓ Successfully followed @${targetUsername}`;
        successMsg.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
        document.body.appendChild(successMsg);
        setTimeout(() => document.body.removeChild(successMsg), 3000);
      }
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
      alert(
        `Failed to ${
          isFollowing ? "unfollow" : "follow"
        } user. Please try again.`
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file) return;

    try {
      setCreateLoading(true);
      console.log("Creating note:", { title, description, isPublic, file });

      setTitle("");
      setDescription("");
      setIsPublic(true);
      setFile(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white mt-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;600;700;800&display=swap');
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

      <div className="max-w-7xl mx-auto px-6 mt-7">
        <div className="h-12">
          <div>
            <Navbar></Navbar>
          </div>
        </div>

        <div className="pb-12 border-b border-blue-400 md:mt-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img
                src={userData.profilePicture}
                alt={userData.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-600 shadow-lg"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white"></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 font-poppins">
                  {userData.name}
                </h1>
                <p className="text-gray-500 text-lg">{userData.username}</p>
              </div>

              <div className="flex justify-center md:justify-start gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.totalPosts || 0}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {(userData.followers || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.following || 0}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 max-w-2xl">{userData.bio}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {isOwnProfile ? (
                  <>
                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                      Edit Profile
                    </button>
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                      Share Profile
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleFollowToggle(userData.username)}
                    disabled={followLoading}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      followLoading
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : isFollowing
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {followLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        {isFollowing ? "Unfollowing..." : "Following..."}
                      </>
                    ) : isFollowing ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <i className="fas fa-file-alt text-blue-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                {userData.name}'s Notes
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {profileNotes.length} notes
            </span>
          </div>

          <div className="relative bg-blue-600 rounded-xl p-6">
            <div className="absolute top-2 right-6 flex gap-2 z-10">
              <button
                className="bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-800 transition"
                onClick={() =>
                  setActiveNoteIndex(
                    (prev) =>
                      (prev - 4 + profileNotes.length) % profileNotes.length
                  )
                }
                aria-label="Previous"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <button
                className="bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-800 transition"
                onClick={() =>
                  setActiveNoteIndex((prev) => (prev + 4) % profileNotes.length)
                }
                aria-label="Next"
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div
              className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4 md:pb-0"
              style={{ scrollBehavior: "smooth" }}
            >
              {(() => {
                let visibleNotes = [];
                if (profileNotes.length < 4) {
                  visibleNotes = [...profileNotes];
                  while (visibleNotes.length < 4) {
                    visibleNotes.push({
                      id: `add-more-${visibleNotes.length}`,
                      addMore: true,
                    });
                  }
                } else {
                  if (profileNotes.length === 3) {
                    for (let i = 0; i < 4; i++) {
                      visibleNotes.push(
                        profileNotes[
                          (activeNoteIndex + i) % profileNotes.length
                        ]
                      );
                    }
                  } else {
                    for (let i = 0; i < 4; i++) {
                      let idx = activeNoteIndex + i;
                      if (idx < profileNotes.length) {
                        visibleNotes.push(profileNotes[idx]);
                      }
                    }
                  }
                }
                return visibleNotes.map((note, idx) =>
                  note.addMore ? (
                    <div
                      key={note.id}
                      className="min-w-[260px] md:min-w-[300px] bg-blue-950 border-2 border-dashed border-blue-700 rounded-xl overflow-hidden hover:border-blue-400 hover:bg-blue-800 transition-all cursor-pointer flex items-center justify-center min-h-[320px] snap-center"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-plus text-3xl text-blue-300"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 font-poppins">
                          Add More Notes
                        </h3>
                        <p className="text-sm text-blue-100">
                          Share your study materials
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={note.id}
                      className="min-w-[260px] md:min-w-[300px] bg-blue-800 border border-blue-700 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer snap-center"
                    >
                      <img
                        src={note.thumbnail}
                        alt={note.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 font-poppins">
                          {note.title}
                        </h3>
                        <p className="text-sm text-blue-100 mb-3">
                          {note.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => toggleLike(note.id)}
                            className="flex items-center gap-2 transition-colors"
                          >
                            <i
                              className={`${
                                likedNotes[note.id] ? "fas" : "far"
                              } fa-heart ${
                                likedNotes[note.id]
                                  ? "text-blue-300"
                                  : "text-blue-200"
                              }`}
                            ></i>
                            <span className="text-blue-100">{note.likes}</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <i className="fas fa-eye text-blue-300"></i>
                            <span className="text-blue-100">{note.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-12">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <i className="fas fa-book-open text-blue-600 text-2xl"></i>
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                  Enrolled Courses
                </h2>
              </div>
              <button
                onClick={() => setShowCourseModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-4">
              {(profileCourses.length > 0
                ? profileCourses
                : fallbackCourses
              ).map((course, index) => {
                const opacity = 0.4 + index * 0.15;
                return (
                  <div
                    key={course.id}
                    className="py-4 hover:bg-blue-50 transition-all cursor-pointer px-2 -mx-2 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `rgba(37, 99, 235, ${opacity})`,
                        }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm font-poppins">
                          {course.name || course.course_name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {course.institution ||
                            course.course_code ||
                            "University"}
                        </p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 mt-4"></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <i className="fas fa-users text-blue-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                Recommended for You
              </h2>
            </div>

            <div className="space-y-4">
              {(recommendations.length > 0
                ? recommendations
                : fallbackRecommendations
              ).map((user) => (
                <div
                  key={user.id}
                  className="py-4 hover:bg-blue-50 transition-all px-2 -mx-2 rounded"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profilePicture || user.profile_picture}
                      alt={user.name || user.full_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 font-poppins">
                        {user.name || user.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">{user.username}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.bio || user.profile_bio}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {user.mutualFollowers || user.mutual_followers || 0}{" "}
                        mutual followers
                      </p>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(user.username)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                      <i className="fas fa-user-plus"></i>
                      Follow
                    </button>
                  </div>
                  <div className="border-b border-gray-200 mt-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-12"></div>
      </div>

      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9998]"></div>
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
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
                    <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
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
                      Upload File *
                    </label>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      accept=".pdf,image/*"
                      maxSize={10}
                    />
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
                      disabled={createLoading || !file}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 font-poppins font-semibold"
                    >
                      {createLoading ? "Creating..." : "Create Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {showFileViewer && currentFile && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[9998]"></div>
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-poppins font-bold text-gray-900">
                    Viewing: {currentFile.name}
                  </h2>
                  <button
                    onClick={() => setShowFileViewer(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close viewer"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4 bg-gray-100 rounded-md">
                  <p className="text-gray-600">
                    File preview would go here (e.g., embed PDF viewer).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showCourseModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9998]"></div>
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">
                  Add Course
                </h3>
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                {availableCourses.map((course) => (
                  <button
                    key={course.id}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i
                        className={`fas fa-${course.icon} text-blue-600 text-xl`}
                      ></i>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 font-poppins">
                      {course.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <Footer></Footer>
    </div>
  );
};

export default Profile;