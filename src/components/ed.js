import React from 'react';
import JSEncrypt from 'jsencrypt';

const ed = () => {
  // Generate a new RSA key pair (public and private keys)
  const encryptor = new JSEncrypt();
  encryptor.getKey();

  // Get the public key to share with others (e.g., for encryption)
  const publicKey = encryptor.getPublicKey();

  // Get the private key to keep securely (e.g., for decryption)
  const privateKey = encryptor.getPrivateKey();

  // Example of encrypting a message using the public key
  const message = 'Hello, this is a secret message!';
  const encryptedMessage = encryptor.encrypt(message);
//   console.log({encryptedMessage})

  // Example of decrypting the encrypted message using the private key
  // Note: Decryption should be done on the server-side or in a more secure environment in a real application.
  const decryptor = new JSEncrypt();
  decryptor.setPrivateKey(privateKey);
  const decryptedMessage = decryptor.decrypt(encryptedMessage);

  return (
    <div>
      <p>Public Key: {publicKey}</p>
      <p>Encrypted Message: {encryptedMessage}</p>
      <p>Decrypted Message: {decryptedMessage}</p>
    </div>
  );
};

export default ed;
