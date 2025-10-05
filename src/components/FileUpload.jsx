import { useState, useRef } from "react";

const FileUpload = ({
  onFileSelect,
  accept = ".pdf",
  maxSize = 10,
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    setError("");

    // Check file type
    if (
      accept &&
      !accept
        .split(",")
        .some(
          (type) =>
            file.name.toLowerCase().endsWith(type.trim().toLowerCase()) ||
            file.type.match(type.trim().replace("*", ".*"))
        )
    ) {
      setError(`Please select a valid file type: ${accept}`);
      return false;
    }

    // Check file size (maxSize in MB)
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
          ${error ? "border-red-300 bg-red-50" : ""}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="space-y-4">
          <div
            className={`text-4xl ${
              error
                ? "text-red-400"
                : dragActive
                ? "text-blue-500"
                : "text-gray-400"
            }`}
          >
            📁
          </div>

          <div>
            <p
              className={`text-lg font-medium ${
                error
                  ? "text-red-700"
                  : dragActive
                  ? "text-blue-700"
                  : "text-gray-700"
              }`}
            >
              {dragActive
                ? "Drop your file here"
                : "Drag and drop your file here, or click to browse"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: {accept} • Max size: {maxSize}MB
            </p>
          </div>

          {!dragActive && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Choose File
            </button>
          )}
        </div>
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default FileUpload;
