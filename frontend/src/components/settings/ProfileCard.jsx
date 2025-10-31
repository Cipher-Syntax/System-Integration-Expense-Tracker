import React from "react";
import { User2, SquarePen } from "lucide-react";

const ProfileCard = ({ userData, onEdit }) => {
    return (
        <>
            <h2 className="font-bold leading-relaxed tracking-wider text-2xl text-gray-500 mt-5">
                Personal Information
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-3 p-5 shadow rounded-2xl">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <User2 size={80} className="text-gray-500" />
                    <div className="text-gray-500 text-sm text-center sm:text-left">
                        <h1 className="text-2xl font-bold">{userData.username}</h1>
                        <p>{userData.phone_number}</p>
                        <p className="break-all">{userData.email}</p>
                    </div>
                </div>

                <button
                    className="mt-4 sm:mt-0 rounded-full px-3 py-2 border text-gray-500 hover:bg-pink-500 hover:text-white flex items-center gap-2 transition"
                    onClick={onEdit}
                >
                    <SquarePen size={15} />
                    <span>Edit</span>
                </button>
            </div>
        </>
    );
};

export default ProfileCard;
