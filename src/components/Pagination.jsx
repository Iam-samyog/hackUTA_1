import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  onPerPageChange,
  perPage = 10,
  total = 0,
}) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers at most
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * perPage + 1, total)} to{" "}
        {Math.min(currentPage * perPage, total)} of {total} results
      </div>

      <div className="flex items-center gap-4">
        {/* Items per page selector */}
        {onPerPageChange && (
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        )}

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={!hasPrev}
            className="px-3 py-2 text-sm border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* First page */}
          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => handlePageClick(1)}
                className="px-3 py-2 text-sm border-t border-b border-gray-300 hover:bg-gray-50"
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && (
                <span className="px-2 py-2 text-sm text-gray-500">...</span>
              )}
            </>
          )}

          {/* Page numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-2 text-sm border-t border-b border-gray-300 hover:bg-gray-50 ${
                page === currentPage
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : ""
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page */}
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] <
                totalPages - 1 && (
                <span className="px-2 py-2 text-sm text-gray-500">...</span>
              )}
              <button
                onClick={() => handlePageClick(totalPages)}
                className="px-3 py-2 text-sm border-t border-b border-gray-300 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next button */}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={!hasNext}
            className="px-3 py-2 text-sm border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
