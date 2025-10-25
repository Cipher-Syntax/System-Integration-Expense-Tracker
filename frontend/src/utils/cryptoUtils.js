import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptId = (id) => {
  return CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
};

export const decryptId = (encryptedId) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || null;
    } 
    catch (error) {
        console.error("Failed to decrypt:", error);
        return null;
    }
};
