import React, { useState, useEffect } from 'react';
import api from '../api/api';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if(!url) return;
        const fetchData = async () => {
            setLoading('loading...');
            setData(null);
            setError(null);

            try{
                const response = await api.get(url);
                setData(response.data);
            }
            catch(error){
                console.log('Failed to get data: ', error);
                setError('Error fetching data: ', error)
            }
            finally{
                setLoading(false);
            }
        }

        fetchData();
    }, [url])
    
    return { data, loading, error }
}

export default useFetch