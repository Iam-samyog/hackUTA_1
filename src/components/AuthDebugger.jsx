import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../config/api";

const AuthDebugger = () => {
  const { user, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      console.log(
        "Current token:",
        token ? token.substring(0, 20) + "..." : "No token"
      );

      setDebugInfo(`
Token exists: ${!!token}
Token length: ${token ? token.length : 0}
User authenticated: ${isAuthenticated}
User data: ${JSON.stringify(user, null, 2)}
Stored user data: ${localStorage.getItem("user_data")}
      `);

      // Test a simple authenticated endpoint
      try {
        const response = await apiRequest("/users/me", { method: "GET" });
        setDebugInfo(
          (prev) =>
            prev +
            "\n\nAPI Test Result: SUCCESS\n" +
            JSON.stringify(response, null, 2)
        );
      } catch (apiError) {
        setDebugInfo(
          (prev) => prev + "\n\nAPI Test Result: FAILED\n" + apiError.message
        );
      }
    } catch (error) {
      setDebugInfo((prev) => prev + "\n\nError: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setDebugInfo("Token and user data cleared");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-lg font-bold mb-4">Authentication Debugger</h3>

      <div className="space-y-4">
        <button
          onClick={testAuth}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Authentication"}
        </button>

        <button
          onClick={clearToken}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
        >
          Clear Auth Data
        </button>

        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
          {debugInfo || 'Click "Test Authentication" to see debug info'}
        </pre>
      </div>
    </div>
  );
};

export default AuthDebugger;
