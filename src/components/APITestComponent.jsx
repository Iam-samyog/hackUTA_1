import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getPublicNotes,
  toggleReaction,
  addComment,
  getNoteReactions,
  getNoteComments,
} from "../services/notesService.js";
import { getAuthToken } from "../config/api.js";

const APITestComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addTestResult = (test, success, data, error) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        success,
        data,
        error: error?.message || error,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const runTest = async (testName, testFunction) => {
    try {
      setLoading(true);
      const result = await testFunction();
      addTestResult(testName, true, result, null);
    } catch (error) {
      addTestResult(testName, false, null, error);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: "Get Public Notes",
      fn: () => getPublicNotes(),
    },
    {
      name: "Check Auth Token",
      fn: () =>
        Promise.resolve({
          token: getAuthToken(),
          user: user,
          hasToken: !!getAuthToken(),
        }),
    },
    {
      name: "Test Reaction (Like)",
      fn: async () => {
        const notes = await getPublicNotes();
        if (notes.length > 0) {
          return await toggleReaction(notes[0].public_id, "like");
        }
        throw new Error("No notes available for testing");
      },
    },
    {
      name: "Test Comment",
      fn: async () => {
        const notes = await getPublicNotes();
        if (notes.length > 0) {
          return await addComment(
            notes[0].public_id,
            "Test comment from debug"
          );
        }
        throw new Error("No notes available for testing");
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">API Test Panel</h2>
            <button
              onClick={() => window.location.reload()}
              className="text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {tests.map((test) => (
              <button
                key={test.name}
                onClick={() => runTest(test.name, test.fn)}
                disabled={loading}
                className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {test.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results:</h3>

            {testResults.length === 0 ? (
              <p className="text-gray-500">
                No tests run yet. Click a test button above.
              </p>
            ) : (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">
                      {result.success ? "✅" : "❌"} {result.test}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {result.timestamp}
                    </span>
                  </div>

                  {result.success ? (
                    <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-red-700">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={() => setTestResults([])}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestComponent;
