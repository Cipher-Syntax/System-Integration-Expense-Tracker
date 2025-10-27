import React, { useEffect, useState } from 'react';
import api from '../api/api';

const useFetchProfile = () => {
    // const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const response = await api.get("api/profile/");
    //             setUser(response.data);
    //             setError(null);
    //         } 
    //         catch (err) {
    //             console.error("Failed to get profile:", err);
    //             setError(err);
    //         } 
    //         finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchProfile();
    
    // }, [])
    // return { user, loading, error}
    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        
        try{
            const response = await api.get('api/profile/');
            return response.data;
        }
        catch (errr) {
            console.error("Failed to get profile:", errr);
            setError(errr);
        }
        finally {
            setLoading(false)
        }
    }

    return { fetchProfile, loading, error }
}

export default useFetchProfile