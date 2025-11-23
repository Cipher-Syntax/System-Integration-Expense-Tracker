// import React, { useState, useEffect } from 'react';
// import api from '../api/api';
// import { Bell, CheckCircle2, Dot, Trash2, Medal } from 'lucide-react';

// const Notification = ({ onUnreadUpdate }) => {
//     const [notifications, setNotifications] = useState([]);
//     const [selectedNotification, setSelectedNotification] = useState(null);

//     // Fetch notifications and poll every 15 seconds
//     useEffect(() => {
//         fetchNotifications();
//         const interval = setInterval(fetchNotifications, 15000);
//         return () => clearInterval(interval);
//     }, []);

//     const fetchNotifications = async () => {
//         try {
//             const res = await api.get('/api/notifications/');
//             const filtered = res.data.filter(n => n.type === 'Recommendation' || n.type === 'Achievement');
//             setNotifications(filtered);

//             // Update unread count
//             const unreadCount = filtered.filter(n => !n.is_read).length;
//             if (onUnreadUpdate) onUnreadUpdate(unreadCount);
//         } catch (err) {
//             console.error('Failed to fetch notifications', err);
//         }
//     };

//     // Open notification and optionally auto-mark as read
//     const handleSelectNotification = async (notification) => {
//         setSelectedNotification(notification);
//         if (!notification.is_read) {
//             await markAsRead(notification);
//         }
//     };

//     const markAsRead = async (notification) => {
//         if (!notification.is_read) {
//             try {
//                 const updatedNotifications = notifications.map(n =>
//                     n.id === notification.id ? { ...n, is_read: true } : n
//                 );
//                 setNotifications(updatedNotifications);
//                 setSelectedNotification(prev => ({ ...prev, is_read: true }));

//                 await api.patch(`/api/notifications/${notification.id}/`, { is_read: true });

//                 if (onUnreadUpdate) {
//                     const unread = updatedNotifications.filter(n => !n.is_read).length;
//                     onUnreadUpdate(unread);
//                 }
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//     };

//     const deleteNotification = async (id) => {
//         try {
//             await api.delete(`/api/notifications/${id}/`);
//             const updated = notifications.filter(n => n.id !== id);
//             setNotifications(updated);
//             setSelectedNotification(null);

//             if (onUnreadUpdate) {
//                 const unread = updated.filter(n => !n.is_read).length;
//                 onUnreadUpdate(unread);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const renderRecommendation = (text) => {
//         if (!text) return null;

//         return text
//             .split(/\n|•|[-*]\s|\d+\./)
//             .filter(line => line && line.trim())
//             .map((line, index) => (
//                 <p key={index} className="mb-1">
//                     • {line.trim()}
//                 </p>
//             ));
//     };


//     return (
//         <section className="mt-26 w-full px-4 sm:px-6 md:px-10">
//             <div className="flex items-center justify-between mb-4">
//                 <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
//             </div>

//             <div className="space-y-2 mt-4 sm:mt-6">
//                 {notifications.map(n => {
//                     const isUnread = !n.is_read;
//                     const bgClass = n.type === 'Recommendation'
//                         ? (isUnread ? 'bg-red-100' : 'bg-gray-200')
//                         : (isUnread ? 'bg-yellow-100' : 'bg-yellow-50');
//                     const borderClass = n.type === 'Recommendation'
//                         ? (isUnread ? 'border-red-400' : 'border-gray-300')
//                         : (isUnread ? 'border-yellow-400' : 'border-yellow-300');
//                     const dotColor = n.type === 'Recommendation' ? 'text-red-700' : 'text-yellow-500';

//                     return (
//                         <div
//                             key={n.id}
//                             onClick={() => handleSelectNotification(n)}
//                             className={`flex items-start p-3 sm:p-4 rounded-lg border transition cursor-pointer hover:shadow ${bgClass} ${borderClass}`}
//                         >
//                             <div className="flex-shrink-0 mr-2 mt-0.5">
//                                 {!n.is_read ? <Dot className={`w-4 h-4 ${dotColor}`} /> :
//                                     n.type === 'Achievement' ? <Medal className="w-4 h-4 text-yellow-400" /> :
//                                         <CheckCircle2 className="w-4 h-4 text-green-500" />}
//                             </div>
//                             <div className="flex-1">
//                                 <h2 className="text-sm sm:text-base font-semibold">{n.title || n.type}</h2>
//                                 <p className="text-gray-600 text-xs sm:text-sm truncate">{n.message}</p>
//                                 <p className="text-gray-400 text-[10px] sm:text-xs">{n.created_at}</p>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {selectedNotification && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
//                     <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md md:max-w-lg shadow-lg relative">
//                         <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
//                             {selectedNotification.type === 'Achievement' ? <Medal className="w-5 h-5 text-yellow-400" /> : null}
//                             {selectedNotification.title || selectedNotification.type}
//                         </h2>
//                         <p className="text-gray-700 mb-4">{selectedNotification.message}</p>

//                         {selectedNotification.type === 'Achievement' && selectedNotification.achievement_details && (
//                             <p className="text-yellow-700 font-semibold mb-4">{selectedNotification.achievement_details}</p>
//                         )}

//                         {selectedNotification.type === 'Recommendation' && selectedNotification.recommendation_details && (
//                             <div className="text-red-700 text-[12px] mb-4 text-justify">
//                                 {renderRecommendation(selectedNotification.recommendation_details)}
//                             </div>
//                         )}

//                         {/* <div className="flex flex-col sm:flex-row justify-between gap-2">
//                             {!selectedNotification.is_read && (
//                                 <button
//                                     onClick={() => markAsRead(selectedNotification)}
//                                     className="px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition text-sm w-full sm:w-auto"
//                                 >
//                                     Mark as Read
//                                 </button>
//                             )}
//                             <button
//                                 onClick={() => deleteNotification(selectedNotification.id)}
//                                 className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm flex items-center gap-1 w-full sm:w-auto justify-center"
//                             >
//                                 <Trash2 className="w-4 h-4" /> Delete
//                             </button>
//                         </div> */}

//                         <button
//                             onClick={() => setSelectedNotification(null)}
//                             className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//                         >
//                             ✕
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };

// export default Notification;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Bell, CheckCircle2, Dot, Trash2, Medal, X } from 'lucide-react';

const Notification = ({ onUnreadUpdate }) => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Fetch notifications and poll every 15 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications/');
            const filtered = res.data.filter(n => n.type === 'Recommendation' || n.type === 'Achievement');
            setNotifications(filtered);

            // Update unread count
            const unreadCount = filtered.filter(n => !n.is_read).length;
            if (onUnreadUpdate) onUnreadUpdate(unreadCount);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    // Open notification and optionally auto-mark as read
    const handleSelectNotification = async (notification) => {
        setSelectedNotification(notification);
        if (!notification.is_read) {
            await markAsRead(notification);
        }
    };

    const markAsRead = async (notification) => {
        if (!notification.is_read) {
            try {
                const updatedNotifications = notifications.map(n =>
                    n.id === notification.id ? { ...n, is_read: true } : n
                );
                setNotifications(updatedNotifications);
                setSelectedNotification(prev => ({ ...prev, is_read: true }));

                await api.patch(`/api/notifications/${notification.id}/`, { is_read: true });

                if (onUnreadUpdate) {
                    const unread = updatedNotifications.filter(n => !n.is_read).length;
                    onUnreadUpdate(unread);
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/api/notifications/${id}/`);
            const updated = notifications.filter(n => n.id !== id);
            setNotifications(updated);
            setSelectedNotification(null);

            if (onUnreadUpdate) {
                const unread = updated.filter(n => !n.is_read).length;
                onUnreadUpdate(unread);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderRecommendation = (text) => {
        if (!text) return null;

        return text
            .split(/\n|•|[-*]\s|\d+\./)
            .filter(line => line && line.trim())
            .map((line, index) => (
                <p key={index} className="mb-2 text-sm sm:text-base leading-relaxed">
                    • {line.trim()}
                </p>
            ));
    };


    return (
        <section className="mt-26 w-full px-4 sm:px-6 md:px-10">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-3 mt-4 sm:mt-6">
                    {notifications.map(n => {
                        const isUnread = !n.is_read;
                        const bgClass = n.type === 'Recommendation'
                            ? (isUnread ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200')
                            : (isUnread ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200');
                        
                        const dotColor = n.type === 'Recommendation' ? 'text-red-500' : 'text-yellow-500';

                        return (
                            <div
                                key={n.id}
                                onClick={() => handleSelectNotification(n)}
                                className={`flex items-start p-4 rounded-xl border shadow-sm active:scale-[0.98] transition-all cursor-pointer ${bgClass}`}
                            >
                                <div className="flex-shrink-0 mr-3 mt-1">
                                    {!n.is_read ? <Dot className={`w-6 h-6 ${dotColor}`} /> :
                                        n.type === 'Achievement' ? <Medal className="w-5 h-5 text-yellow-500" /> :
                                            <CheckCircle2 className="w-5 h-5 text-gray-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h2 className={`text-sm sm:text-base ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                            {n.title || n.type}
                                        </h2>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(n.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-xs sm:text-sm truncate mt-1">{n.message}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL */}
            {selectedNotification && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div 
                        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start p-5 sm:p-6 border-b border-gray-100">
                            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 pr-6">
                                {selectedNotification.type === 'Achievement' && <Medal className="w-6 h-6 text-yellow-500" />}
                                {selectedNotification.title || selectedNotification.type}
                            </h2>
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-5 sm:p-6 overflow-y-auto">
                            <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                                {selectedNotification.message}
                            </p>

                            {selectedNotification.type === 'Achievement' && selectedNotification.achievement_details && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                    <p className="text-yellow-800 font-semibold text-center">
                                        {selectedNotification.achievement_details}
                                    </p>
                                </div>
                            )}

                            {selectedNotification.type === 'Recommendation' && selectedNotification.recommendation_details && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-800 text-justify">
                                    {renderRecommendation(selectedNotification.recommendation_details)}
                                </div>
                            )}
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => deleteNotification(selectedNotification.id)}
                                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 active:bg-red-200 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" /> 
                                Delete
                            </button>
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="w-full sm:flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Notification;