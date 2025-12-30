import CryptoJS from "crypto-js";
import Cookies from "js-cookie";


const REACT_APP_ENCRYPT_SECRET_KEY = process.env.REACT_APP_ENCRYPT_SECRET_KEY
console.log("secretkey:",REACT_APP_ENCRYPT_SECRET_KEY)

// Encrypt and store
export const setEncryptedCookie = (key, value, days = 7) => {
  console.log("reached here ")
  const encrypted = CryptoJS.AES.encrypt(value,REACT_APP_ENCRYPT_SECRET_KEY).toString();
  console.log("encrypted:",encrypted)
  Cookies.set(key, encrypted, {
    expires: days,
    secure: true,
  });
};

// Read and decrypt
export const getEncryptedCookie = (key) => {
  const encrypted = Cookies.get(key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, REACT_APP_ENCRYPT_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Cookie decrypt error:", err);
    return null;
  }
};

// Delete cookie
export const removeEncryptedCookie = (key) => {
  Cookies.remove(key);
};



// Encrypt and store in localStorage
export const setEncryptedLocal = (key, value) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), REACT_APP_ENCRYPT_SECRET_KEY).toString();
  console.log("encrypted:",encrypted)
  localStorage.setItem(key, encrypted);
};


export const getEncryptedLocal = (key) => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted,REACT_APP_ENCRYPT_SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error("LocalStorage decrypt error:", err);
    return null;
  }
};

export const removeEncryptedLocal = (key) => {
  localStorage.removeItem(key);
};
