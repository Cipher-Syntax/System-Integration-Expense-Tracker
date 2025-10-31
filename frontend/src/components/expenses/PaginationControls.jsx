import React from 'react';

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
                First
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 border rounded cursor-pointer ${
                            currentPage === page ? 'bg-pink-500 text-white' : ''
                        }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
                Last
            </button>
        </div>
    );
};

export default PaginationControls;
