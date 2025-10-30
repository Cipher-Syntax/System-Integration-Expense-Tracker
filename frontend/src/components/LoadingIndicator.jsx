import React from 'react'

const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-15 h-15 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
    )
}

export default LoadingIndicator