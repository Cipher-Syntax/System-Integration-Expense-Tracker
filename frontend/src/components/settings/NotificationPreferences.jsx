import React from "react";
import { Mail, Phone, Bell } from "lucide-react";

const NotificationPreferences = ({
    emailNotif,
    smsNotif,
    budgetAlert,
    setEmailNotif,
    setSmsNotif,
    setBudgetAlert,
    onSave
}) => {
    const preferences = [
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
    ];

    return (
        <>
            <h2 className="font-bold text-2xl text-gray-500 mt-10">
                Notification Preferences
            </h2>

            <div className="space-y-4">
                {preferences.map((item, i) => (
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

                <div className="flex justify-end mt-4">
                    <button
                        className="bg-pink-600 text-white font-bold rounded-full px-5 py-2 hover:bg-pink-700 transition"
                        onClick={onSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotificationPreferences;
