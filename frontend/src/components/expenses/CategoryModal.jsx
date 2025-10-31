import React, { useState } from 'react';

const CategoryModal = ({ onSave, onClose }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleSave = async () => {
        if (!newCategory) return;
        await onSave(newCategory);
        setNewCategory('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 sm:px-0">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-[90%] sm:w-[350px]">
                <h2 className="text-lg font-semibold mb-4 text-center">Create New Category</h2>
                <input
                    type="text"
                    placeholder="Category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border w-full mb-4 p-2 rounded"
                />
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 border rounded w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-pink-500 text-white rounded w-full sm:w-auto"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
