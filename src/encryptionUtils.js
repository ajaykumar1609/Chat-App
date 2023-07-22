import CryptoJS from "crypto-js";

export function encryptMessage(message, key) {
  const encryptedMessage = CryptoJS.AES.encrypt(message, key).toString();
  return encryptedMessage;
}

export function decryptMessage(encryptedMessage, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, key);
  const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}
