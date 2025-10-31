import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks";

import { ProfileCard, EditProfileModal, NotificationPreferences, DeleteAccountModal, SaveSuccessToast } from '../components/settings'
import { LoadingIndicator } from "../components";

const Settings = () => {
    const { data, loading, error } = useFetch("api/profile");
    const [userData, setUserData] = useState({});
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(true);
    const [budgetAlert, setBudgetAlert] = useState(true);

    const [isEditModal, setIsEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [message, setMessage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setUserData(data);
            setUsername(data.username || "");
            setPhoneNumber(data.phone_number || "");
            setEmail(data.email || "");
            setEmailNotif(data.email_notification);
            setSmsNotif(data.sms_notification);
            setBudgetAlert(data.budget_alerts);
        }
    }, [data]);

    const handleSaveProfile = async () => {
        try {
            const payload = { username, phone_number: phoneNumber, email };
            const response = await api.patch("api/profile/", payload);
            setUserData(response.data);
            setIsEditModal(false);
            showToast();
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handlePreferenceSave = async () => {
        try {
            const payload = {
                email_notification: emailNotif,
                sms_notification: smsNotif,
                budget_alerts: budgetAlert,
            };
            await api.patch("api/profile/", payload);
            showToast();
        } catch (error) {
            console.error("Failed to save preferences:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete("api/user/");
            navigate("/login");
        } catch (error) {
            console.error("Account deletion failed:", error);
        }
    };

    const showToast = () => {
        setMessage(true);
        setTimeout(() => setMessage(false), 2000);
    };

    if (loading){
        return (
            <LoadingIndicator />
        )
    };
    if (error){
        return (
            <LoadingIndicator />
        )
    };

    return (
        <section className="mt-26 w-full mx-auto px-4">
            <h1 className="text-3xl font-bold leading-relaxed tracking-widest">
                Settings & Profile
            </h1>

            <div className="mb-8 w-full bg-white rounded-2xl py-5 px-4 sm:px-8 mt-10">
                <ProfileCard
                    userData={userData}
                    onEdit={() => setIsEditModal(true)}
                />

                <NotificationPreferences
                    emailNotif={emailNotif}
                    smsNotif={smsNotif}
                    budgetAlert={budgetAlert}
                    setEmailNotif={setEmailNotif}
                    setSmsNotif={setSmsNotif}
                    setBudgetAlert={setBudgetAlert}
                    onSave={handlePreferenceSave}
                />

                <div className="mt-10">
                    <DeleteAccountModal
                        show={showDeleteModal}
                        onDelete={handleDelete}
                        onClose={() => setShowDeleteModal(false)}
                        trigger={() => setShowDeleteModal(true)}
                    />
                </div>

                {isEditModal && (
                    <EditProfileModal
                        username={username}
                        phoneNumber={phoneNumber}
                        email={email}
                        setUsername={setUsername}
                        setPhoneNumber={setPhoneNumber}
                        setEmail={setEmail}
                        onSave={handleSaveProfile}
                        onClose={() => setIsEditModal(false)}
                    />
                )}

                {message && (
                    <SaveSuccessToast icon={CheckCircle} />
                )}
            </div>
        </section>
    );
};

export default Settings;
