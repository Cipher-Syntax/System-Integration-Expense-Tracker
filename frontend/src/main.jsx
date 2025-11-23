import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
import emailjs from '@emailjs/browser';

emailjs.init('7a6O7c6pDsPPXm36t')

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <App></App>
        </GoogleOAuthProvider>
    </StrictMode>
)