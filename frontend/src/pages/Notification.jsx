import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Bell, CheckCircle2, Dot, Trash2, Medal } from 'lucide-react';

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
                <p key={index} className="mb-1 text-xs sm:text-sm">
                    • {line.trim()}
                </p>
            ));
    };


    return (
        <section className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Notifications</h1>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {notifications.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No notifications</p>
                    ) : (
                        notifications.map(n => {
                            const isUnread = !n.is_read;
                            const bgClass = n.type === 'Recommendation'
                                ? (isUnread ? 'bg-red-100' : 'bg-gray-200')
                                : (isUnread ? 'bg-yellow-100' : 'bg-yellow-50');
                            const borderClass = n.type === 'Recommendation'
                                ? (isUnread ? 'border-red-400' : 'border-gray-300')
                                : (isUnread ? 'border-yellow-400' : 'border-yellow-300');
                            const dotColor = n.type === 'Recommendation' ? 'text-red-700' : 'text-yellow-500';

                            return (
                                <div
                                    key={n.id}
                                    onClick={() => handleSelectNotification(n)}
                                    className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg border transition cursor-pointer hover:shadow-md active:shadow-sm ${bgClass} ${borderClass}`}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {!n.is_read ? <Dot className={`w-4 h-4 sm:w-5 sm:h-5 ${dotColor}`} /> :
                                            n.type === 'Achievement' ? <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> :
                                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm sm:text-base md:text-lg font-semibold truncate">{n.title || n.type}</h2>
                                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{n.message}</p>
                                        <p className="text-gray-400 text-[10px] sm:text-xs mt-1">{n.created_at}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {selectedNotification && (
                    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 md:p-6">
                        <div className="bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 w-full sm:max-w-md md:max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                            >
                                ✕
                            </button>

                            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 flex items-center gap-2 pr-8">
                                {selectedNotification.type === 'Achievement' ? <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" /> : null}
                                <span className="truncate">{selectedNotification.title || selectedNotification.type}</span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{selectedNotification.message}</p>

                            {selectedNotification.type === 'Achievement' && selectedNotification.achievement_details && (
                                <p className="text-yellow-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{selectedNotification.achievement_details}</p>
                            )}

                            {selectedNotification.type === 'Recommendation' && selectedNotification.recommendation_details && (
                                <div className="text-red-700 text-xs sm:text-sm mb-4 sm:mb-6 text-justify">
                                    {renderRecommendation(selectedNotification.recommendation_details)}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => deleteNotification(selectedNotification.id)}
                                    className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition text-sm sm:text-base flex items-center justify-center gap-2 w-full"
                                >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /> Delete
                                </button>
                                <button
                                    onClick={() => setSelectedNotification(null)}
                                    className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition text-sm sm:text-base w-full"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Notification;