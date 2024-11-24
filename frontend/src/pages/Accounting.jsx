import React, { useState } from "react";

const Accounting = () => {
  const data = [
    { id: 1, name: "Product 1", category: "Category A" },
    { id: 2, name: "Product 2", category: "Category B" },
    { id: 3, name: "Product 3", category: "Category A" },
    { id: 4, name: "Product 4", category: "Category B" },
    { id: 5, name: "Product 5", category: "Category A" },
    { id: 6, name: "Product 6", category: "Category C" },
    { id: 7, name: "Product 7", category: "Category A" },
    { id: 8, name: "Product 8", category: "Category B" },
    { id: 9, name: "Product 9", category: "Category A" },
    { id: 10, name: "Product 10", category: "Category C" },
    { id: 11, name: "Product 11", category: "Category A" },
    { id: 12, name: "Product 12", category: "Category B" },
    { id: 13, name: "Product 13", category: "Category A" },
    { id: 14, name: "Product 14", category: "Category C" },
    { id: 15, name: "Product 15", category: "Category B" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  return (
    <div className="p-4">
      {/* Table */}
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Name</th>
            <th className="border border-gray-300 p-2 text-left">Category</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">{item.id}</td>
              <td className="border border-gray-300 p-2">{item.name}</td>
              <td className="border border-gray-300 p-2">{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        {/* Previous Page */}
        <button
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          className={`px-3 py-1 border rounded ${
            currentPage === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
        >
          {"<<"}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`px-3 py-1 border rounded ${
            currentPage === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
        >
          {"<"}
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`px-3 py-1 border rounded ${
              index === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages - 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
        >
          {">"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages - 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default Accounting;
