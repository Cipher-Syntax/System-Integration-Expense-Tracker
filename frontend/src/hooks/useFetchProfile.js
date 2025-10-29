import React, { useEffect, useState } from 'react';
import api from '../api/api';

const useFetchProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("api/profile/");
                console.log(response.data)
                setUser(response.data);
                setError(null);
            } 
            catch (err) {
                console.error("Failed to get profile:", err);
                setError(err);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    
    }, [])
    return { user, loading, error}
}

export default useFetchProfile