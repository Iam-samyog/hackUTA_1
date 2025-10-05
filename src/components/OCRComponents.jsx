import React from "react";

const OCRStatusBadge = ({ ocrStatus, hasMarkdown, className = "" }) => {
  const getStatusConfig = () => {
    switch (ocrStatus) {
      case "pending":
        return {
          text: "OCR Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          icon: "⏳",
        };
      case "processing":
        return {
          text: "Processing...",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: "🔄",
        };
      case "completed":
        return hasMarkdown
          ? {
              text: "AI Content Ready",
              bgColor: "bg-green-100",
              textColor: "text-green-800",
              icon: "✅",
            }
          : {
              text: "OCR Complete",
              bgColor: "bg-green-100",
              textColor: "text-green-800",
              icon: "✅",
            };
      case "failed":
        return {
          text: "OCR Failed",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: "❌",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <span>{config.icon}</span>
      {config.text}
    </span>
  );
};

const OCRProgressIndicator = ({ ocrStatus, onRefresh }) => {
  if (ocrStatus !== "processing") return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span className="text-sm text-blue-800">
        AI is analyzing your document and generating searchable content...
      </span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
        >
          Refresh
        </button>
      )}
    </div>
  );
};

const OCRErrorMessage = ({ ocrStatus, errorMessage, onRetry }) => {
  if (ocrStatus !== "failed") return null;

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600">❌</span>
        <span className="text-sm font-medium text-red-800">
          OCR Processing Failed
        </span>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-700 mb-2">{errorMessage}</p>
      )}
      <p className="text-sm text-red-600">
        The AI couldn't process this document. This might happen with very
        blurry images or complex layouts.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try uploading again
        </button>
      )}
    </div>
  );
};

const OCRFeatureHighlight = ({ className = "" }) => {
  return (
    <div
      className={`p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🤖</span>
        <h3 className="font-semibold text-gray-900">
          AI-Powered Content Extraction
        </h3>
      </div>
      <p className="text-sm text-gray-700 mb-3">
        Upload PDFs or images and our AI will automatically extract text,
        equations, and structure into searchable content.
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span>✍️</span>
          <span>Handwriting recognition</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🧮</span>
          <span>Math equations (LaTeX)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📊</span>
          <span>Table extraction</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔍</span>
          <span>Searchable text</span>
        </div>
      </div>
    </div>
  );
};

export {
  OCRStatusBadge,
  OCRProgressIndicator,
  OCRErrorMessage,
  OCRFeatureHighlight,
};
export default OCRStatusBadge;
