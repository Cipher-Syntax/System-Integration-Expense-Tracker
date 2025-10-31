import React from "react";

const EditProfileModal = ({
    username,
    phoneNumber,
    email,
    setUsername,
    setPhoneNumber,
    setEmail,
    onSave,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-[400px] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <label className="text-sm font-bold">Phone</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <label className="text-sm font-bold">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                        Cancel
                    </button>
                    <button onClick={onSave} className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
