import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllCourses,
  getMyCourses,
  createCourse,
  enrollInCourses,
} from "../services/courseService.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare, faBook, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import NavbarNew from "./NavbarNew";

const Courses = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu

  // Course creation modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");

  // Enrollment states
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      const [allCoursesData, myCoursesData] = await Promise.all([
        getAllCourses(),
        getMyCourses(),
      ]);
      setAllCourses(allCoursesData);
      setMyCourses(myCoursesData);
    } catch (error) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim() || !courseCode.trim()) return;

    try {
      setCreateLoading(true);
      await createCourse({
        name: courseName,
        code: courseCode,
      });

      setCourseName("");
      setCourseCode("");
      setShowCreateModal(false);
      fetchCoursesData();
    } catch (error) {
      setError("Failed to create course");
      console.error("Error creating course:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEnrollment = async () => {
    if (selectedCourses.length === 0) return;

    try {
      setEnrollLoading(true);
      await enrollInCourses(selectedCourses);

      setSelectedCourses([]);
      fetchCoursesData();
    } catch (error) {
      setError("Failed to enroll in courses");
      console.error("Error enrolling in courses:", error);
    } finally {
      setEnrollLoading(false);
    }
  };

  const toggleCourseSelection = (courseCode) => {
    setSelectedCourses((prev) =>
      prev.includes(courseCode)
        ? prev.filter((code) => code !== courseCode)
        : [...prev, courseCode]
    );
  };

  const isEnrolled = (courseCode) => {
    return myCourses.some((course) => course.code === courseCode);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

  {/* Navbar */}
  <NavbarNew />

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
            className="text-blue-600 font-poppins font-semibold text-left"
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
            className="px-4 py-2 bg-blue-600 text-white font-poppins font-semibold rounded-full hover:bg-blue-700 transition-all text-left"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Course
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-poppins font-semibold rounded-full hover:bg-gray-300 transition-all text-left"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-4 text-sm underline hover:text-red-900 flex items-center"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-1" /> Dismiss
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
              Courses
            </h1>
            <p className="text-gray-600">
              Discover courses and manage your enrollments
            </p>
          </div>

          {/* Enrollment Actions */}
          {selectedCourses.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                {selectedCourses.length} course
                {selectedCourses.length > 1 ? "s" : ""} selected
              </p>
              <button
                onClick={handleEnrollment}
                disabled={enrollLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                <FontAwesomeIcon icon={faCheckSquare} className="mr-2" />
                {enrollLoading ? "Enrolling..." : "Enroll in Selected"}
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-gray-800 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faBook} className="mr-2" /> All Courses (
              {allCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "my"
                  ? "border-gray-800 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faUserGraduate} className="mr-2" /> My
              Courses ({myCourses.length})
            </button>
          </nav>
        </div>

        {/* Courses Grid */}
        {activeTab === "all" ? (
          <div>
            {allCourses.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faBook} className="text-gray-400 text-6xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No courses available
                </h3>
                <p className="text-gray-500 mb-6">
                  Be the first to create a course!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create First
                  Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {course.name}
                          </h3>
                          <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                            {course.code}
                          </p>
                        </div>

                        {!isEnrolled(course.code) && (
                          <div className="ml-4">
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(course.code)}
                              onChange={() =>
                                toggleCourseSelection(course.code)
                              }
                              className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isEnrolled(course.code)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isEnrolled(course.code) ? "Enrolled" : "Available"}
                        </span>

                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors flex items-center">
                          <FontAwesomeIcon icon={faEye} className="mr-1" /> View
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {myCourses.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faUserGraduate} className="text-gray-400 text-6xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No enrolled courses
                </h3>
                <p className="text-gray-500 mb-6">
                  Enroll in courses to start learning!
                </p>
                <button
                  onClick={() => setActiveTab("all")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FontAwesomeIcon icon={faBook} className="mr-2" /> Browse All
                  Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {course.name}
                          </h3>
                          <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                            {course.code}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Enrolled
                        </span>
                      </div>

                      <div className="mt-4">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                          <FontAwesomeIcon icon={faUserGraduate} className="mr-2" /> Access Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Course
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g., Introduction to Computer Science"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) =>
                      setCourseCode(e.target.value.toUpperCase())
                    }
                    placeholder="e.g., CS101"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
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
                    {createLoading ? "Creating..." : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;