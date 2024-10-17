// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    return (
        <div>
            <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
