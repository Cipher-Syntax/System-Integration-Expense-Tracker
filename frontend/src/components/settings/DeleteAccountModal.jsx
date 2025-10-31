import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteAccountModal = ({ show, onDelete, onClose, trigger }) => {
    return (
        <>
            <h2 className="font-bold text-2xl text-gray-500">Account Management</h2>

            <div
                className="flex items-center mt-3 gap-x-2 cursor-pointer"
                onClick={trigger}
            >
                <Trash2 className="text-red-500" />
                <p className="text-red-500 font-bold tracking-widest">Delete Account</p>
            </div>

            {show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-[350px] shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="text-red-500" />
                            <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">
                            Are you sure you want to permanently delete your account? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onDelete}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteAccountModal;
