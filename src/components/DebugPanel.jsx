import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getAuthToken } from "../config/api.js";
import APITestComponent from "./APITestComponent.jsx";

const DebugPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const [showAPITest, setShowAPITest] = useState(false);

  if (showAPITest) {
    return <APITestComponent />;
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="bg-yellow-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
          title="Show Debug Info"
        >
          🐛
        </button>
      </div>
    );
  }

  const token = getAuthToken();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Info</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="text-sm space-y-2">
        <div>
          <strong>Auth Status:</strong>{" "}
          {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
        </div>

        <div>
          <strong>User:</strong>{" "}
          {user ? user.username || "No username" : "No user"}
        </div>

        <div>
          <strong>Token:</strong>{" "}
          {token ? `${token.substring(0, 20)}...` : "No token"}
        </div>

        <div>
          <strong>API Base:</strong> http://localhost:5000/api
        </div>

        <div className="pt-2 border-t border-gray-700 space-y-2">
          <button
            onClick={() => {
              console.log("Full Debug Info:", {
                user,
                isAuthenticated,
                token,
                localStorage: localStorage.getItem("auth_token"),
              });
            }}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 w-full"
          >
            Log Full Info
          </button>

          <button
            onClick={() => setShowAPITest(true)}
            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 w-full"
          >
            Test API Endpoints
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
