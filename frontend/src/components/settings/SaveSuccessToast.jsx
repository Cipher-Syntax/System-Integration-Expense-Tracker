import React from "react";

const SaveSuccessToast = ({ icon: Icon }) => {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-green-500 w-16 h-16 rounded-full flex items-center justify-center 
                        shadow-lg z-50 animate-slide-down">
            <Icon className="text-white w-8 h-8" />
        </div>
    );
};

export default SaveSuccessToast;
