import React, { useState, useEffect } from 'react'
import { Mail, Phone, Bell, CheckCircle, CircleUser, SquarePen, Trash2  } from "lucide-react";
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks';

const Settings = () => {
    // const { user } = useFetchProfile();
    // const { user, loading, error } = useFetchProfile()
    const { data, loading, error } = useFetch('api/profile');

    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [email, setEmail] = useState("");

    const [userData, setUserData] = useState([]);
    const [isEditModal, setIsEditModal] = useState(false);

    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(true);
    const [budgetAlert, setBudgetAlert] = useState(true);
    const [message, setMessage] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate()

    const handleSave = async () => {
        try {
            const payload = {
                username,
                phone_number: phoneNumber,
                email
            };
            const response = await api.patch('api/profile/', payload);
            setIsEditModal(false);
            setUserData(response.data);

            setMessage(true);
            const timer = setTimeout(() => {
                setMessage(false);
            }, 2000)

            return () => clearTimeout(timer)
        } 
        catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handlePreferenceSave = async () => {
        try {
            const payload = {
                email_notification: emailNotif,
                sms_notification: smsNotif,
                budget_alerts: budgetAlert,
            };
            const response = await api.patch('api/profile/', payload);

            setMessage(true);
            const timer = setTimeout(() => {
                setMessage(false);
            }, 2000)

            return () => clearTimeout(timer)
        } 
        catch (error) {
            console.error('Failed to save preferences:', error);
        }
    };

    const handleDelete = async () => {
        await api.delete('api/user/');
        navigate('/login')
    }

    useEffect(() => {
        if (data) {
            setUserData(data);
            setUsername(data.username);
            setPhoneNumber(data.phone_number);
            setEmail(data.email);

            setEmailNotif(data.email_notification);
            setSmsNotif(data.sms_notification);
            setBudgetAlert(data.budget_alerts);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Failed to load profile</p>;


    return (
        <section className="mt-26 w-full mx-auto px-4">
            <h1 className="text-3xl font-bold leading-relaxed tracking-widest">
                Settings & Profile
            </h1>

            <div className="mb-8 w-full bg-white rounded-2xl py-5 px-4 sm:px-8 h-auto mt-10">
                <div>
                <h2 className="font-bold leading-relaxed tracking-wider text-2xl text-gray-500 mt-5">
                    Personal Information
                </h2>

                {/* Profile Card */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mt-3 px-3 sm:px-5 gap-4 p-5 shadow rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-x-5">
                    <CircleUser size={80} className="text-gray-500" />
                    <div className="text-gray-500 text-sm sm:text-[12px] leading-relaxed tracking-wider text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold">{userData.username}</h1>
                        <p>{userData.phone_number}</p>
                        <p className="break-all">{userData.email}</p>
                    </div>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mt-3 px-3 sm:px-5 gap-4 p-5 shadow rounded-2xl">
                    <div className="flex flex-col gap-4 w-full">
                    <div className="text-gray-500 text-sm leading-relaxed tracking-wider flex flex-col">
                        <label htmlFor="username" className="text-xs font-bold">
                        Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username || ""}
                            className="text-base sm:text-[16px] border-none bg-transparent"
                            readOnly
                        />
                    </div>

                    <div className="text-gray-500 text-sm leading-relaxed tracking-wider flex flex-col">
                        <label htmlFor="phone" className="text-xs font-bold">
                        Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={userData.phone_number || ""}
                            className="text-base sm:text-[16px] border-none bg-transparent"
                            readOnly
                        />
                    </div>

                    <div className="text-gray-500 text-sm leading-relaxed tracking-wider flex flex-col">
                        <label htmlFor="email" className="text-xs font-bold">
                        Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email || ""}
                            className="text-base sm:text-[16px] w-full sm:w-[500px] border-none bg-transparent break-all"
                            readOnly
                        />
                    </div>
                    </div>

                    <div
                    className="mt-4 sm:mt-0 self-center sm:self-start w-[80px] sm:w-[70px] rounded-full p-2 border flex items-center justify-center text-xs sm:text-[12px] gap-x-2 text-gray-500 cursor-pointer hover:bg-pink-500 hover:text-white hover:translate-y-[-3px] transition duration-75 ease-in-out"
                    onClick={() => setIsEditModal(true)}
                    >
                    <SquarePen size={15} />
                    <p>Edit</p>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white p-5 sm:p-6 rounded-2xl w-full max-w-[400px] shadow-lg relative">
                        <h2 className="text-xl font-bold mb-4 text-center sm:text-left">Edit Profile</h2>

                        <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold">Username</label>
                            <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border p-2 rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-bold">Phone</label>
                            <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border p-2 rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-bold">Email</label>
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded"
                            />
                        </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5">
                        <button
                            onClick={() => setIsEditModal(false)}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
                        >
                            Save
                        </button>
                        </div>
                    </div>
                    </div>
                )}

                {/* Notification Preferences */}
                <h2 className="font-bold leading-relaxed tracking-wider text-2xl text-gray-500 mt-10">
                    Notification Preferences
                </h2>

                <div className="space-y-4">
                    {[ // Reuse pattern for toggles
                    {
                        icon: <Mail className="w-5 h-5 text-pink-600" />,
                        title: "Email Notifications",
                        desc: "Receive updates via email",
                        checked: emailNotif,
                        onChange: setEmailNotif,
                    },
                    {
                        icon: <Phone className="w-5 h-5 text-pink-600" />,
                        title: "SMS Notifications",
                        desc: "Receive updates via SMS",
                        checked: smsNotif,
                        onChange: setSmsNotif,
                    },
                    {
                        icon: <Bell className="w-5 h-5 text-pink-600" />,
                        title: "Budget Alerts",
                        desc: "Alert when approaching budget limit",
                        checked: budgetAlert,
                        onChange: setBudgetAlert,
                    },
                    ].map((item, i) => (
                    <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3"
                    >
                        <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer self-end sm:self-center">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.checked}
                            onChange={(e) => item.onChange(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-pink-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                    ))}

                    <div className="w-full flex justify-center sm:justify-end">
                    <button
                        className="bg-pink-600 text-white font-bold leading-relaxed tracking-wider w-full sm:w-[100px] rounded-full p-2 cursor-pointer"
                        onClick={handlePreferenceSave}
                    >
                        Save
                    </button>
                    </div>
                </div>

                {message && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                    bg-green-500 w-16 h-16 rounded-full flex items-center justify-center 
                                    shadow-lg animate-slide-down z-50">
                    <CheckCircle className="text-white w-8 h-8" />
                    </div>
                )}

                {/* Account Management */}
                <h2 className="font-bold leading-relaxed tracking-wider text-2xl text-gray-500 mt-10">
                    Account Management
                </h2>

                <div
                    className="flex items-center mt-3 gap-x-2 cursor-pointer"
                    onClick={() => setShowDeleteModal(true)}
                >
                    <Trash2 className="text-red-500" />
                    <p className="text-red-500 font-bold leading-relaxed tracking-widest">
                    Delete Account
                    </p>
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-5 sm:p-6 rounded-2xl w-full max-w-[350px] shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-3 text-center sm:text-left">
                        Confirm Deletion
                        </h2>
                        <p className="text-gray-600 text-sm mb-6 text-center sm:text-left">
                        Are you sure you want to permanently delete your account? This action cannot be undone.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                            await handleDelete();
                            setShowDeleteModal(false);
                            }}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                    </div>
                )}
                </div>
            </div>
        </section>

    )
}

export default Settings