import { useState } from "react";
import { apiRequest } from "../config/api.js";

const CORSDebugger = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (method, endpoint, body = null) => {
    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();

    try {
      console.log(`Testing ${method} ${endpoint}...`);

      const options = {
        method: method,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const result = await apiRequest(endpoint, options);

      setResults((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp,
          method,
          endpoint,
          status: "SUCCESS",
          data: result,
        },
      ]);
    } catch (error) {
      console.error(`${method} ${endpoint} failed:`, error);

      setResults((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp,
          method,
          endpoint,
          status: "ERROR",
          error: error.message,
          fullError: error,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const runCORSTests = async () => {
    setResults([]);

    // Test basic connectivity
    await testEndpoint("GET", "/auth/me");

    // Test a simple POST
    await testEndpoint("POST", "/notes/test-note-id/comments", {
      content: "Test comment",
    });

    // Test reaction
    await testEndpoint("POST", "/notes/test-note-id/reactions", {
      reaction_type: "concise",
    });

    // Test OPTIONS request (preflight)
    try {
      const response = await fetch(
        "http://localhost:5000/api/notes/test/comments",
        {
          method: "OPTIONS",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      setResults((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          method: "OPTIONS",
          endpoint: "/notes/test/comments",
          status: response.ok ? "SUCCESS" : "ERROR",
          headers: Object.fromEntries(response.headers.entries()),
        },
      ]);
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          method: "OPTIONS",
          endpoint: "/notes/test/comments",
          status: "ERROR",
          error: error.message,
        },
      ]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">CORS & API Debugger</h2>

      <button
        onClick={runCORSTests}
        disabled={loading}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Run CORS Tests"}
      </button>

      <button
        onClick={() => setResults([])}
        className="mb-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Clear Results
      </button>

      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className={`p-4 rounded border-l-4 ${
              result.status === "SUCCESS"
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">
                {result.method} {result.endpoint}
              </span>
              <span className="text-sm text-gray-500">{result.timestamp}</span>
            </div>

            <div
              className={`font-medium ${
                result.status === "SUCCESS" ? "text-green-700" : "text-red-700"
              }`}
            >
              Status: {result.status}
            </div>

            {result.error && (
              <div className="mt-2 text-red-600">
                <strong>Error:</strong> {result.error}
              </div>
            )}

            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">
                  Response Data
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}

            {result.headers && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">
                  Response Headers
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Click "Run CORS Tests" to start debugging
        </div>
      )}
    </div>
  );
};

export default CORSDebugger;
