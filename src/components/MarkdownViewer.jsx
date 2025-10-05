import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "katex/dist/katex.min.css";
import { getMarkdownContent } from "../services/notesService.js";

const MarkdownViewer = ({ notePublicId, isOpen, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const contentRef = useRef();

  useEffect(() => {
    if (isOpen && notePublicId) {
      fetchMarkdownContent();
    }
  }, [isOpen, notePublicId]);

  const fetchMarkdownContent = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMarkdownContent(notePublicId);

      console.log("Markdown response:", response);

      // Handle different response structures
      let content = "";
      if (response && response.markdown) {
        content = response.markdown;
      } else if (response && response.markdown_content) {
        content = response.markdown_content;
      } else if (typeof response === "string") {
        content = response;
      }

      if (content) {
        // Auto-correct common LaTeX issues
        content = autoCorrectLatex(content);
        setMarkdownContent(content);
      } else {
        setError(
          "Markdown content is not available for this note yet. The AI processing may still be in progress."
        );
      }
    } catch (error) {
      console.error("Error fetching markdown:", error);
      setError("Failed to load markdown content. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to auto-correct common LaTeX issues
  const autoCorrectLatex = (content) => {
    return (
      content
        // Fix missing backslashes for common functions
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "\\frac{$1}{$2}")
        // Fix cases environment - ensure proper alignment
        .replace(
          /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
          (match, cases) => {
            const correctedCases = cases
              .replace(/\\\\\s*/g, " \\\\\n") // Add newlines after \\
              .replace(/([^\\])\\([^\\])/g, "$1\\\\$2") // Fix single backslashes
              .trim();
            return `\\begin{cases}\n${correctedCases}\n\\end{cases}`;
          }
        )
        // Fix integral limits
        .replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, "\\int_{$1}^{$2}")
        // Fix limit expressions
        .replace(/\\lim_\{([^}]+)\}/g, "\\lim_{$1}")
        // Ensure proper spacing around operators
        .replace(/([^\\])=([^\\])/g, "$1 = $2")
        .replace(/([^\\])\+([^\\])/g, "$1 + $2")
        .replace(/([^\\])-([^\\])/g, "$1 - $2")
        // Fix square roots
        .replace(/\\sqrt\{([^}]+)\}/g, "\\sqrt{$1}")
        // Add spacing around display math (FIXED - removed extra $$ symbols)
        .replace(/\$\$([\s\S]*?)\$\$/g, "\n\n$$$1$$\n\n")
    );
  };

  const generatePDF = async () => {
    if (!markdownContent) {
      setError("No markdown content available to convert to PDF");
      return;
    }

    try {
      setGenerating(true);

      // Create a temporary div to render the markdown with LaTeX
      const tempDiv = document.createElement("div");
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 800px;
        padding: 40px;
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 16px;
        line-height: 1.8;
        color: #2d3748;
        background: white;
        box-sizing: border-box;
      `;

      // Ensure KaTeX CSS is loaded
      if (!document.querySelector('link[href*="katex"]')) {
        const katexLink = document.createElement("link");
        katexLink.rel = "stylesheet";
        katexLink.href =
          "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css";
        katexLink.crossOrigin = "anonymous";
        document.head.appendChild(katexLink);

        // Wait for CSS to load
        await new Promise((resolve) => {
          katexLink.onload = resolve;
          setTimeout(resolve, 1000); // Fallback timeout
        });
      }

      document.body.appendChild(tempDiv);

      // Use ReactDOM to render the markdown component
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempDiv);

      // Render the markdown with LaTeX
      await new Promise((resolve) => {
        root.render(
          React.createElement(ReactMarkdown, {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
            children: markdownContent,
          })
        );

        // Wait longer for LaTeX to render properly
        setTimeout(() => {
          // Check if KaTeX has rendered by looking for .katex elements
          const katexElements = tempDiv.querySelectorAll(".katex");
          console.log(`Found ${katexElements.length} KaTeX elements`);
          resolve();
        }, 5000); // Increased timeout for better LaTeX rendering
      });

      // Apply additional styling after rendering
      const elements = tempDiv.querySelectorAll("*");
      elements.forEach((el) => {
        if (el.tagName === "H1") {
          el.style.cssText = `
            font-size: 32px;
            font-weight: bold;
            color: #1a202c;
            margin: 40px 0 24px 0;
            padding-bottom: 12px;
            border-bottom: 3px solid #3182ce;
          `;
        } else if (el.tagName === "H2") {
          el.style.cssText = `
            font-size: 26px;
            font-weight: bold;
            color: #2d3748;
            margin: 32px 0 20px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #63b3ed;
          `;
        } else if (el.tagName === "H3") {
          el.style.cssText = `
            font-size: 22px;
            font-weight: bold;
            color: #4a5568;
            margin: 28px 0 16px 0;
          `;
        } else if (el.tagName === "P") {
          el.style.cssText = `
            margin: 0 0 20px 0;
            text-align: justify;
            text-indent: 24px;
          `;
        } else if (el.tagName === "PRE") {
          el.style.cssText = `
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 14px;
            overflow-x: auto;
            line-height: 1.5;
          `;
        } else if (
          el.tagName === "CODE" &&
          el.parentElement?.tagName !== "PRE"
        ) {
          el.style.cssText = `
            background: #edf2f7;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 14px;
            color: #2d3748;
          `;
        }
      });

      // Capture as canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
      });

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add title page
      pdf.setFontSize(24);
      pdf.text("AI Generated Content", pdfWidth / 2, 40, { align: "center" });
      pdf.setFontSize(14);
      pdf.text(`Note ID: ${notePublicId}`, pdfWidth / 2, 60, {
        align: "center",
      });
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth / 2, 75, {
        align: "center",
      });
      pdf.text("Powered by NoteLens AI", pdfWidth / 2, 90, { align: "center" });

      // Add content
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        imgWidth,
        Math.min(imgHeight, pdfHeight - 20)
      );

      // Handle multi-page content
      if (imgHeight > pdfHeight - 20) {
        let remainingHeight = imgHeight - (pdfHeight - 20);
        let currentY = pdfHeight - 20;

        while (remainingHeight > 0) {
          pdf.addPage();
          const pageHeight = Math.min(remainingHeight, pdfHeight - 20);

          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = canvas.width;
          tempCanvas.height = (pageHeight * canvas.width) / imgWidth;

          tempCtx.drawImage(
            canvas,
            0,
            (currentY * canvas.width) / imgWidth,
            canvas.width,
            tempCanvas.height,
            0,
            0,
            canvas.width,
            tempCanvas.height
          );

          const pageImgData = tempCanvas.toDataURL("image/png");
          pdf.addImage(pageImgData, "PNG", 10, 10, imgWidth, pageHeight);

          currentY += pageHeight;
          remainingHeight -= pageHeight;
        }
      }

      // Save PDF
      const fileName = `AI_Generated_Note_${notePublicId}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>
        {`
          .markdown-preview h1 {
            font-size: 2rem;
            font-weight: bold;
            color: #1a202c;
            margin: 2.5rem 0 1.5rem 0;
            padding-bottom: 0.75rem;
            border-bottom: 3px solid #3182ce;
          }
          .markdown-preview h2 {
            font-size: 1.625rem;
            font-weight: bold;
            color: #2d3748;
            margin: 2rem 0 1.25rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #63b3ed;
          }
          .markdown-preview h3 {
            font-size: 1.375rem;
            font-weight: bold;
            color: #4a5568;
            margin: 1.75rem 0 1rem 0;
          }
          .markdown-preview p {
            margin: 0 0 1.25rem 0;
            text-align: justify;
            text-indent: 1.5rem;
          }
          .markdown-preview pre {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1.25rem;
            margin: 1.5rem 0;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
            line-height: 1.5;
          }
          .markdown-preview code {
            background: #edf2f7;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.875rem;
            color: #2d3748;
          }
          .markdown-preview pre code {
            background: transparent;
            padding: 0;
          }
          .markdown-preview .katex-display {
            margin: 2rem 0 !important;
            padding: 1.5rem !important;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%) !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          .markdown-preview .katex {
            font-size: 1.1em !important;
          }
        `}
      </style>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              AI Generated Content
            </h2>
            <p className="text-gray-600">
              Preview and download as PDF with LaTeX rendering
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 space-y-6">
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && markdownContent && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Rendered Preview with LaTeX
                    </h3>
                    <p className="text-sm text-gray-600">
                      This is how your content will appear in the PDF (including
                      LaTeX math)
                    </p>
                  </div>
                  <div className="text-green-500">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Rendered markdown preview with LaTeX */}
                <div
                  ref={contentRef}
                  className="bg-white rounded border p-6 max-h-96 overflow-y-auto markdown-preview"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#2d3748",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>

                {/* Download button */}
                <div className="mt-6">
                  <button
                    onClick={generatePDF}
                    disabled={generating}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3"
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating PDF with LaTeX...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Download Rendered PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !markdownContent && (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <p>No content available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Powered by Google Gemini 2.0 Flash AI
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (markdownContent) {
                    navigator.clipboard.writeText(markdownContent);
                  }
                }}
                disabled={!markdownContent}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm disabled:text-gray-400 transition-colors"
              >
                Copy Raw Text
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewer;
