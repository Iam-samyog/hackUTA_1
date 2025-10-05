import { useState } from "react";

const FileViewer = ({ fileUrl, fileName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName || "note.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {fileName || "File Viewer"}
            </h3>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <span>Download</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading file...</p>
              </div>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Unable to display file
                </h3>
                <p className="text-gray-500 mb-4">
                  The file might be corrupted or in an unsupported format.
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download File
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              onError={handleError}
              title={fileName || "File Preview"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
