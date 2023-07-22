// import NodeRSA from 'node-rsa';

// const keySize = 2048; // Key size in bits (adjust as needed)

// // Function to generate a new key pair for a user
// export const generateKeyPair = () => {
//   const key = new NodeRSA({ b: keySize });
//   return {
//     publicKey: key.exportKey('public'),
//     privateKey: key.exportKey('private'),
//   };
// };

// // Function to encrypt a message using the recipient's public key
// export const encryptMessage = (message, recipientPublicKey) => {
//   const key = new NodeRSA();
//   key.importKey(recipientPublicKey, 'public');
//   return key.encrypt(message, 'base64');
// };

//     // ... (previous code)

// // Function to decrypt a message using the user's private key
// export const decryptMessage = (encryptedMessage, privateKey) => {
//     const key = new NodeRSA();
//     key.importKey(privateKey, 'private');
//     return key.decrypt(encryptedMessage, 'utf8');
//   };
  