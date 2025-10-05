import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NoteLensHomepage from "./components/NoteLensHomepage";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import NoteDetail from "./components/NoteDetail";
import Courses from "./components/Courses";
import Search from "./components/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import DebugPanel from "./components/DebugPanel";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import About from "./components/About.jsx";
// Home component that redirects based on auth status
const Home = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Also check localStorage directly as a fallback
  const hasToken = localStorage.getItem("auth_token");

  console.log("Home component - Auth state:", {
    isAuthenticated,
    loading,
    user,
    hasToken: !!hasToken,
  });

  if (loading) {
    console.log("Home component - Still loading auth state");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  // Use both context state and direct token check
  const shouldRedirectToDashboard = isAuthenticated || hasToken;

  console.log(
    "Home component - Auth check complete, redirecting:",
    shouldRedirectToDashboard ? "to dashboard" : "to landing page"
  );

  return shouldRedirectToDashboard ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <NoteLensHomepage />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Temporarily made public for debugging */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/note/:publicId" element={<NoteDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/notedetail" element={<NoteDetail />} />
          <Route path="/about" element={<About/>}></Route>
        </Routes>

        {/* Debug Panel - only shows in development */}
        {process.env.NODE_ENV === "development" && <DebugPanel />}
      </Router>
    </AuthProvider>
  );
}

export default App;
