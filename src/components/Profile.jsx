import { useState, useRef } from "react";
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
import { faFilePdf, faTimes, faCamera } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FileUpload = ({ onFileSelect, accept, maxSize }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Device detection
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

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
    if (file && file.type === "application/pdf") {
      if (file.size > maxSize * 1024 * 1024) {
        setShowSizeAlert(true);
      } else {
        setSelectedFile(file);
        onFileSelect(file);
      }
    } else {
      alert(`Please drop a PDF file under ${maxSize}MB.`);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      if (file.size > maxSize * 1024 * 1024) {
        setShowSizeAlert(true);
      } else {
        setSelectedFile(file);
        onFileSelect(file);
      }
    } else {
      alert(`Please select a PDF file under ${maxSize}MB.`);
    }
  };

  const handleCameraButtonClick = () => {
    if (isMobile) {
      if (cameraInputRef.current) cameraInputRef.current.click();
    } else {
      // Desktop: open webcam modal
      setShowWebcamModal(true);
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setWebcamStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          alert('Unable to access webcam.');
        });
    }
  };

  const handleWebcamCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'webcam.jpg', { type: 'image/jpeg' });
          setSelectedFile(file);
          onFileSelect(file);
          setShowWebcamModal(false);
          if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
            setWebcamStream(null);
          }
        }
      }, 'image/jpeg');
    }
  };

  const handleWebcamModalClose = () => {
    setShowWebcamModal(false);
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
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
    } else {
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
        <p className="text-gray-600 mb-2">Drag and drop a PDF file here, or</p>
        <div className="flex gap-4 justify-center">
          <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faFilePdf} />
            Add PDF
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
            capture="environment"
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">File Size Exceeded</h3>
              <p className="text-gray-600 mb-6">Please select a file smaller than 10MB.</p>
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
            <video ref={videoRef} autoPlay playsInline className="w-80 h-60 bg-black rounded" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="mt-4 flex gap-4">
              <button onClick={handleWebcamCapture} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Capture</button>
              <button onClick={handleWebcamModalClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
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

  const userData = {
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    followers: 1234,
    following: 567,
    totalPosts: 89,
    bio: "Medical student 📚 | Research enthusiast | Sharing study notes and insights",
  };

  const userNotes = [
    {
      id: 1,
      title: "Organic Chemistry - Reactions",
      description:
        "Comprehensive notes on substitution and elimination reactions",
      thumbnail:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop",
      likes: 234,
      views: 1250,
    },
    {
      id: 2,
      title: "Human Anatomy - Cardiovascular System",
      description: "Detailed study guide for cardiovascular physiology",
      thumbnail:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
      likes: 189,
      views: 980,
    },
    {
      id: 3,
      title: "Biochemistry - Metabolism Pathways",
      description: "Visual maps of glycolysis and Krebs cycle",
      thumbnail:
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=600&fit=crop",
      likes: 312,
      views: 1580,
    },
  ];

  const enrolledCourses = [
    {
      id: 1,
      name: "Advanced Organic Chemistry",
      institution: "Stanford University",
      progress: 75,
    },
    {
      id: 2,
      name: "Human Physiology",
      institution: "MIT OpenCourseWare",
      progress: 60,
    },
    {
      id: 3,
      name: "Medical Biochemistry",
      institution: "Harvard Medical School",
      progress: 85,
    },
    {
      id: 4,
      name: "Clinical Pharmacology",
      institution: "Johns Hopkins University",
      progress: 45,
    },
  ];

  const availableCourses = [
    { id: 1, name: "Physics", icon: "atom" },
    { id: 2, name: "Mathematics", icon: "calculator" },
    { id: 3, name: "Chemistry", icon: "flask" },
    { id: 4, name: "Computer Science", icon: "laptop-code" },
  ];

  const recommendations = [
    {
      id: 1,
      name: "Michael Chen",
      username: "@mchen",
      profilePicture:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      followers: 2341,
      bio: "PhD candidate in Neuroscience",
      mutualFollowers: 12,
    },
    {
      id: 2,
      name: "Emma Wilson",
      username: "@emmaw",
      profilePicture:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      followers: 1876,
      bio: "Chemistry tutor & content creator",
      mutualFollowers: 8,
    },
    {
      id: 3,
      name: "David Park",
      username: "@dpark",
      profilePicture:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      followers: 3102,
      bio: "Medical school graduate",
      mutualFollowers: 15,
    },
  ];

  const toggleLike = (noteId) => {
    setLikedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
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
    <div className="min-h-screen bg-white">
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
                    {userData.totalPosts}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.followers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.following}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 max-w-2xl">{userData.bio}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                  Edit Profile
                </button>
                <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <i className="fas fa-file-alt text-blue-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                My Notes
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {userNotes.length} notes
            </span>
          </div>

          <div className="relative bg-blue-600 rounded-xl p-6">
            <div className="absolute top-2 right-6 flex gap-2 z-10">
              <button
                className="bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-800 transition"
                onClick={() =>
                  setActiveNoteIndex(
                    (prev) => (prev - 4 + userNotes.length) % userNotes.length
                  )
                }
                aria-label="Previous"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <button
                className="bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-800 transition"
                onClick={() =>
                  setActiveNoteIndex((prev) => (prev + 4) % userNotes.length)
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
                if (userNotes.length < 4) {
                  visibleNotes = [...userNotes];
                  while (visibleNotes.length < 4) {
                    visibleNotes.push({
                      id: `add-more-${visibleNotes.length}`,
                      addMore: true,
                    });
                  }
                } else {
                  if (userNotes.length === 3) {
                    for (let i = 0; i < 4; i++) {
                      visibleNotes.push(
                        userNotes[(activeNoteIndex + i) % userNotes.length]
                      );
                    }
                  } else {
                    for (let i = 0; i < 4; i++) {
                      let idx = activeNoteIndex + i;
                      if (idx < userNotes.length) {
                        visibleNotes.push(userNotes[idx]);
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
              {enrolledCourses.map((course, index) => {
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
                          {course.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {course.institution}
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
              {recommendations.map((user) => (
                <div
                  key={user.id}
                  className="py-4 hover:bg-blue-50 transition-all px-2 -mx-2 rounded"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 font-poppins">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600">{user.username}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.bio}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {user.mutualFollowers} mutual followers
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 text-sm whitespace-nowrap">
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
                      accept=".pdf"
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
                  <p className="text-gray-600">File preview would go here (e.g., embed PDF viewer).</p>
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