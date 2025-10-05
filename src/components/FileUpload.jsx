import { useState, useRef } from "react";

const FileUpload = ({
  onFileSelect,
  accept = ".pdf",
  maxSize = 10,
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
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
      setSelectedFile(file);
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

      {/* Camera input for mobile and desktop */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        id="cameraInput"
        onChange={handleChange}
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

          {/* Show selected file with remove option */}
          {selectedFile && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-white bg-blue-700 px-3 py-1 rounded font-poppins text-sm">
                <i className="fas fa-file mr-2"></i>
                {selectedFile.name}
              </span>
              <button
                type="button"
                className="text-white bg-red-600 hover:bg-red-700 rounded-full p-2 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setError("");
                  fileInputRef.current.value = "";
                  document.getElementById('cameraInput').value = "";
                  if (typeof onFileSelect === 'function') {
                    onFileSelect(null);
                  }
                }}
                aria-label="Remove file"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {!dragActive && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-poppins font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                <i className="fas fa-file-upload mr-2"></i>
                Choose File
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-poppins font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  // Open camera on mobile, webcam on desktop
                  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                  if (isMobile) {
                    document.getElementById('cameraInput').click();
                  } else {
                    // Use MediaDevices API for webcam
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      navigator.mediaDevices.getUserMedia({ video: true })
                        .then((stream) => {
                          // Create a video element to show webcam
                          const video = document.createElement('video');
                          video.srcObject = stream;
                          video.play();
                          video.style.position = 'fixed';
                          video.style.top = '50%';
                          video.style.left = '50%';
                          video.style.transform = 'translate(-50%, -50%)';
                          video.style.zIndex = '9999';
                          video.style.background = '#0a174e';
                          video.style.borderRadius = '1rem';
                          video.style.boxShadow = '0 4px 32px #19376d';
                          video.width = 480;
                          video.height = 360;
                          document.body.appendChild(video);

                          // Add capture button
                          const captureBtn = document.createElement('button');
                          captureBtn.innerHTML = '<i class="fas fa-camera"></i> Capture';
                          captureBtn.style.position = 'fixed';
                          captureBtn.style.top = 'calc(50% + 200px)';
                          captureBtn.style.left = '50%';
                          captureBtn.style.transform = 'translate(-50%, 0)';
                          captureBtn.style.zIndex = '10000';
                          captureBtn.style.background = '#2563eb';
                          captureBtn.style.color = '#fff';
                          captureBtn.style.fontSize = '1.25rem';
                          captureBtn.style.padding = '0.75rem 2rem';
                          captureBtn.style.borderRadius = '0.75rem';
                          captureBtn.style.border = 'none';
                          captureBtn.style.boxShadow = '0 2px 12px #19376d';
                          captureBtn.style.cursor = 'pointer';
                          document.body.appendChild(captureBtn);

                          // Add close (cross) button
                          const closeBtn = document.createElement('button');
                          closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                          closeBtn.style.position = 'fixed';
                          closeBtn.style.top = 'calc(50% - 220px)';
                          closeBtn.style.left = 'calc(50% + 220px)';
                          closeBtn.style.transform = 'translate(-50%, -50%)';
                          closeBtn.style.zIndex = '10001';
                          closeBtn.style.background = '#ef4444';
                          closeBtn.style.color = '#fff';
                          closeBtn.style.fontSize = '1.5rem';
                          closeBtn.style.padding = '0.5rem 0.9rem';
                          closeBtn.style.borderRadius = '50%';
                          closeBtn.style.border = 'none';
                          closeBtn.style.boxShadow = '0 2px 12px #19376d';
                          closeBtn.style.cursor = 'pointer';
                          closeBtn.setAttribute('aria-label', 'Close camera');
                          document.body.appendChild(closeBtn);

                          closeBtn.onclick = () => {
                            stream.getTracks().forEach(track => track.stop());
                            document.body.removeChild(video);
                            document.body.removeChild(captureBtn);
                            document.body.removeChild(closeBtn);
                          };

                          captureBtn.onclick = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                            canvas.toBlob((blob) => {
                              const file = new File([blob], 'webcam.jpg', { type: 'image/jpeg' });
                              setSelectedFile(file);
                              onFileSelect(file);
                            }, 'image/jpeg');
                            // Cleanup
                            stream.getTracks().forEach(track => track.stop());
                            document.body.removeChild(video);
                            document.body.removeChild(captureBtn);
                            document.body.removeChild(closeBtn);
                          };
                        })
                        .catch((err) => {
                          alert('Unable to access webcam.');
                        });
                    } else {
                      alert('Webcam not supported.');
                    }
                  }
                }}
              >
                <i className="fas fa-camera mr-2"></i>
                Camera
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default FileUpload;
