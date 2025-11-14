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
                <p key={index} className="mb-1">
                    • {line.trim()}
                </p>
            ));
    };


    return (
        <section className="mt-26 w-full px-4 sm:px-6 md:px-10">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
            </div>

            <div className="space-y-2 mt-4 sm:mt-6">
                {notifications.map(n => {
                    const isUnread = !n.is_read;
                    const bgClass = n.type === 'Recommendation'
                        ? (isUnread ? 'bg-red-100' : 'bg-red-50')
                        : (isUnread ? 'bg-yellow-100' : 'bg-yellow-50');
                    const borderClass = n.type === 'Recommendation'
                        ? (isUnread ? 'border-red-400' : 'border-red-300')
                        : (isUnread ? 'border-yellow-400' : 'border-yellow-300');
                    const dotColor = n.type === 'Recommendation' ? 'text-red-700' : 'text-yellow-500';

                    return (
                        <div
                            key={n.id}
                            onClick={() => handleSelectNotification(n)}
                            className={`flex items-start p-3 sm:p-4 rounded-lg border transition cursor-pointer hover:shadow ${bgClass} ${borderClass}`}
                        >
                            <div className="flex-shrink-0 mr-2 mt-0.5">
                                {!n.is_read ? <Dot className={`w-4 h-4 ${dotColor}`} /> :
                                    n.type === 'Achievement' ? <Medal className="w-4 h-4 text-yellow-400" /> :
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-sm sm:text-base font-semibold">{n.title || n.type}</h2>
                                <p className="text-gray-600 text-xs sm:text-sm truncate">{n.message}</p>
                                <p className="text-gray-400 text-[10px] sm:text-xs">{n.created_at}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedNotification && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
                    <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md md:max-w-lg shadow-lg relative">
                        <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
                            {selectedNotification.type === 'Achievement' ? <Medal className="w-5 h-5 text-yellow-400" /> : null}
                            {selectedNotification.title || selectedNotification.type}
                        </h2>
                        <p className="text-gray-700 mb-4">{selectedNotification.message}</p>

                        {selectedNotification.type === 'Achievement' && selectedNotification.achievement_details && (
                            <p className="text-yellow-700 font-semibold mb-4">{selectedNotification.achievement_details}</p>
                        )}

                        {selectedNotification.type === 'Recommendation' && selectedNotification.recommendation_details && (
                            <div className="text-red-700 text-[12px] mb-4 text-justify">
                                {renderRecommendation(selectedNotification.recommendation_details)}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                            {!selectedNotification.is_read && (
                                <button
                                    onClick={() => markAsRead(selectedNotification)}
                                    className="px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition text-sm w-full sm:w-auto"
                                >
                                    Mark as Read
                                </button>
                            )}
                            <button
                                onClick={() => deleteNotification(selectedNotification.id)}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm flex items-center gap-1 w-full sm:w-auto justify-center"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>

                        <button
                            onClick={() => setSelectedNotification(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Notification;
