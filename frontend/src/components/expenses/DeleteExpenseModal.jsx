import React from 'react';

const DeleteExpenseModal = ({ deleteTarget, onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 sm:px-0">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-[90%] sm:w-[350px]">
                <h2 className="text-lg font-semibold mb-4 text-center">Delete this expense?</h2>
                <p className="text-gray-600 text-center mb-4 break-words">
                    “{deleteTarget.name}” will be permanently removed.
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 border rounded cursor-pointer w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer w-full sm:w-auto"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteExpenseModal;
