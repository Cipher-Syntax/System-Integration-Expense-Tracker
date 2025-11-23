import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

console.log("EmailJS Config:");
console.log("SERVICE_ID:", SERVICE_ID);
console.log("TEMPLATE_ID:", TEMPLATE_ID);
console.log("PUBLIC_KEY:", PUBLIC_KEY);

// Check if credentials exist
if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
  console.error("❌ Missing EmailJS credentials!");
}

export const sendEmail = (templateParams) => {
  console.log("sendEmail called with:", templateParams);
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
};