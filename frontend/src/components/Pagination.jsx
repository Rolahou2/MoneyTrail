import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  //if (totalPages <= 1) return null; // Hide pagination if only one page

  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="button pagination-button"
      >
        {"<<"}
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="button pagination-button"
      >
        {"<"}
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`button pagination-button ${
            currentPage === index + 1 ? "active" : ""
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="button pagination-button"
      >
        {">"}
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="button pagination-button"
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
