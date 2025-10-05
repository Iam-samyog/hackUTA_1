import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoteLensHomepage from "./components/NoteLensHomepage";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import NoteDetail from "./components/NoteDetail";
import Courses from "./components/Courses";
import Search from "./components/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import DebugPanel from "./components/DebugPanel";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<NoteLensHomepage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/note/:publicId"
            element={
              <ProtectedRoute>
                <NoteDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Debug Panel - only shows in development */}
        {process.env.NODE_ENV === "development" && <DebugPanel />}
      </Router>
    </AuthProvider>
  );
}

export default App;
