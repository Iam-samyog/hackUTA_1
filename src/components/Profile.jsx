import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Users, FileText, UserPlus, Search, Bell, Home, MessageCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Profile = () => {
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [likedNotes, setLikedNotes] = useState({});

  // Sample user data
  const userData = {
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    followers: 1234,
    following: 567,
    totalPosts: 89,
    bio: "Medical student 📚 | Research enthusiast | Sharing study notes and insights"
  };

  // Sample notes data
  const userNotes = [
    {
      id: 1,
      title: "Organic Chemistry - Reactions",
      description: "Comprehensive notes on substitution and elimination reactions",
      thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop",
      likes: 234,
      views: 1250
    },
    {
      id: 2,
      title: "Human Anatomy - Cardiovascular System",
      description: "Detailed study guide for cardiovascular physiology",
      thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
      likes: 189,
      views: 980
    },
    {
      id: 3,
      title: "Biochemistry - Metabolism Pathways",
      description: "Visual maps of glycolysis and Krebs cycle",
      thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=600&fit=crop",
      likes: 312,
      views: 1580
    }
  ];

  // Sample courses data
  const enrolledCourses = [
    {
      id: 1,
      name: "Advanced Organic Chemistry",
      institution: "Stanford University",
      progress: 75
    },
    {
      id: 2,
      name: "Human Physiology",
      institution: "MIT OpenCourseWare",
      progress: 60
    },
    {
      id: 3,
      name: "Medical Biochemistry",
      institution: "Harvard Medical School",
      progress: 85
    },
    {
      id: 4,
      name: "Clinical Pharmacology",
      institution: "Johns Hopkins University",
      progress: 45
    }
  ];

  const availableCourses = [
    { id: 1, name: "Physics", icon: "atom" },
    { id: 2, name: "Mathematics", icon: "calculator" },
    { id: 3, name: "Chemistry", icon: "flask" },
    { id: 4, name: "Computer Science", icon: "laptop-code" }
  ];

  // Sample recommendations
  const recommendations = [
    {
      id: 1,
      name: "Michael Chen",
      username: "@mchen",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      followers: 2341,
      bio: "PhD candidate in Neuroscience",
      mutualFollowers: 12
    },
    {
      id: 2,
      name: "Emma Wilson",
      username: "@emmaw",
      profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      followers: 1876,
      bio: "Chemistry tutor & content creator",
      mutualFollowers: 8
    },
    {
      id: 3,
      name: "David Park",
      username: "@dpark",
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      followers: 3102,
      bio: "Medical school graduate",
      mutualFollowers: 15
    }
  ];

  const toggleLike = (noteId) => {
    setLikedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
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
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 mt-7">
        <div className="h-12">
            <div>
                <Navbar></Navbar>
            </div>
        </div>

        {/* Profile Header */}
        <div className="pb-12 border-b border-blue-400 md:mt-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={userData.profilePicture}
                alt={userData.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-600 shadow-lg"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 font-poppins">{userData.name}</h1>
                <p className="text-gray-500 text-lg">{userData.username}</p>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userData.totalPosts}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userData.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userData.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 mb-6 max-w-2xl">{userData.bio}</p>

              {/* Action Buttons */}
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

        {/* Notes Section */}
        <div className="py-12 border-b border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <i className="fas fa-file-alt text-blue-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900 font-poppins">My Notes</h2>
            </div>
            <span className="text-sm text-gray-500">{userNotes.length} notes</span>
          </div>

          {/* Notes Grid */}
          <div className="relative bg-blue-600 rounded-xl p-6">
            {/* Carousel Arrows */}
            <div className="absolute top-2 right-6 flex gap-2 z-10">
              <button
                className="bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-800 transition"
                onClick={() => setActiveNoteIndex((prev) => (prev - 4 + userNotes.length) % userNotes.length)}
                aria-label="Previous"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <button
                className="bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-800 transition"
                onClick={() => setActiveNoteIndex((prev) => (prev + 4) % userNotes.length)}
                aria-label="Next"
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            {/* Horizontal Scroll Carousel */}
            <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4 md:pb-0" style={{scrollBehavior: 'smooth'}}>
              {
                (() => {
                  // Always show up to 4 cards: notes + Add More card if less than 4
                  let visibleNotes = [];
                  if (userNotes.length < 4) {
                    visibleNotes = [...userNotes];
                    // Fill with Add More card(s) if less than 4
                    while (visibleNotes.length < 4) {
                      visibleNotes.push({ id: `add-more-${visibleNotes.length}`, addMore: true });
                    }
                  } else {
                    // Arrow navigation: show 3 notes starting from activeNoteIndex, but do NOT repeat notes if total is less than 4
                    if (userNotes.length === 3) {
                      for (let i = 0; i < 4; i++) {
                        visibleNotes.push(userNotes[(activeNoteIndex + i) % userNotes.length]);
                      }
                    } else {
                      // If more than 4 notes, normal carousel
                      for (let i = 0; i < 4; i++) {
                        let idx = activeNoteIndex + i;
                        if (idx < userNotes.length) {
                          visibleNotes.push(userNotes[idx]);
                        }
                      }
                    }
                  }
                  return visibleNotes.map((note, idx) => note.addMore ? (
                    <div key={note.id} className="min-w-[260px] md:min-w-[300px] bg-blue-950 border-2 border-dashed border-blue-700 rounded-xl overflow-hidden hover:border-blue-400 hover:bg-blue-800 transition-all cursor-pointer flex items-center justify-center min-h-[320px] snap-center">
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-plus text-3xl text-blue-300"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 font-poppins">Add More Notes</h3>
                        <p className="text-sm text-blue-100">Share your study materials</p>
                      </div>
                    </div>
                  ) : (
                    <div key={note.id} className="min-w-[260px] md:min-w-[300px] bg-blue-800 border border-blue-700 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer snap-center">
                      <img
                        src={note.thumbnail}
                        alt={note.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 font-poppins">{note.title}</h3>
                        <p className="text-sm text-blue-100 mb-3">{note.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <button 
                            onClick={() => toggleLike(note.id)}
                            className="flex items-center gap-2 transition-colors"
                          >
                            <i className={`${likedNotes[note.id] ? 'fas' : 'far'} fa-heart ${likedNotes[note.id] ? 'text-blue-300' : 'text-blue-200'}`}></i>
                            <span className="text-blue-100">{note.likes}</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <i className="fas fa-eye text-blue-300"></i>
                            <span className="text-blue-100">{note.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()
              }
            </div>
          </div>
        </div>

        {/* Two Column Layout for Courses and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-12">
          {/* Enrolled Courses */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <i className="fas fa-book-open text-blue-600 text-2xl"></i>
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">Enrolled Courses</h2>
              </div>
              <button 
                onClick={() => setShowCourseModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add</span>
              </button>
            </div>

            {/* Circular Progress Diagram */}

            {/* Course List */}
            <div className="space-y-4">
              {enrolledCourses.map((course, index) => {
                const opacity = 0.4 + (index * 0.15);
                return (
                  <div key={course.id} className="py-4 hover:bg-blue-50 transition-all cursor-pointer px-2 -mx-2 rounded">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: `rgba(37, 99, 235, ${opacity})` }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm font-poppins">{course.name}</h3>
                        <p className="text-xs text-gray-600">{course.institution}</p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 mt-4"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <i className="fas fa-users text-blue-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900 font-poppins">Recommended for You</h2>
            </div>

            <div className="space-y-4">
              {recommendations.map((user) => (
                <div key={user.id} className="py-4 hover:bg-blue-50 transition-all px-2 -mx-2 rounded">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 font-poppins">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.username}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.bio}</p>
                      <p className="text-xs text-blue-600 mt-1">{user.mutualFollowers} mutual followers</p>
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

        {/* Bottom spacing */}
        <div className="h-12"></div>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 font-poppins">Add Course</h3>
              <button 
                onClick={() => setShowCourseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-3">
              {availableCourses.map((course) => (
                <button
                  key={course.id}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className={`fas fa-${course.icon} text-blue-600 text-xl`}></i>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 font-poppins">{course.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer></Footer>
    </div>
    
  );
};

export default Profile;