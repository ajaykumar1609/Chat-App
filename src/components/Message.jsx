import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
// import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import { db } from "../firebase";
import { doc, updateDoc,serverTimestamp } from "firebase/firestore";

const Message = ({ message,messages }) => {
  // console.log(message)
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
   // Function to handle decryption
   const handleDecrypt = (t) => {
    const bytes = CryptoJS.AES.decrypt(t, data.chatId);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // setDecryptedMessage(decrypted);
    return decrypted
  };

  // // Function to decrypt the message text using the appropriate RSA private key
  // const decryptMessage = (encryptedText) => {
  //   // const chatId =
  //   //   currentUser.uid > message.senderId
  //   //     ? currentUser.uid + message.senderId
  //   //     : message.senderId + currentUser.uid;

  //   // Get the RSA private key from the ChatContext based on the chatId
  //   const privateKey = data.keyPairs[data.chatId]?.privateKey;

  //   if (!privateKey) {
  //     // If the private key is not available (e.g., key pair not generated yet),
  //     // return the encrypted text as is or handle it as needed.
  //     return encryptedText;
  //   }

  //   // Create a new instance of JSEncrypt and set the private key
  //   const decryptor = new JSEncrypt();
  //   decryptor.setPrivateKey(privateKey);

  //   // Use the decryptor to decrypt the message text
  //   return decryptor.decrypt(encryptedText);
  // };

  // Add a state to track whether the delete button is visible
  const [deleteVisible, setDeleteVisible] = useState(false);

  // Function to handle the delete action
  const handleDelete = async () => {
    // Check if the user is the sender of the message before allowing deletion
    if (message.senderId === currentUser.uid) {
      try {
        // Find the document reference for the chat
        const chatRef = doc(db, "chats", data.chatId);

        // Filter out the message to be deleted from the messages array
        const updatedMessages = messages.filter((m) => m.id !== message.id);

        // Update the messages array in the document
        await updateDoc(chatRef, { messages: updatedMessages });

        const lastMessageUpdate = {
          [`${data.chatId}.lastMessage`]: {
            text: "deleted", // Replace "deleted" with the variable or message content you want to show for the last message
            // You can add other properties like date if needed, similar to the previous example
          },
          [`${data.chatId}.date`]: serverTimestamp(),
        };
    
        // Update for the sender (current user)
        await updateDoc(doc(db, "userChats", currentUser.uid), lastMessageUpdate);
    
        // Update for the receiver (the other user in the chat)
        await updateDoc(doc(db, "userChats", data.user.uid), lastMessageUpdate);

      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  // Function to show the delete button on mouse over
  const handleMouseOver = () => {
    setDeleteVisible(true);
  };

  // Function to hide the delete button on mouse out
  const handleMouseOut = () => {
    setDeleteVisible(false);
  };

  

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

    // Function to convert Firebase Timestamp to a human-readable date string
  const formatDate = (timestamp) => {
    const dateObject = timestamp.toDate();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return 'Today ' + dateObject.toLocaleTimeString(); // For Today's messages
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday ' + dateObject.toLocaleTimeString(); // For Yesterday's messages
    } else {
      return dateObject.toLocaleString(); // For other messages, show the full date and time
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
    {deleteVisible && message.senderId === currentUser.uid && (
        <button onClick={handleDelete} className="deleteButton">
          Delete
        </button>
      )}
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <small>{formatDate(message.date)}</small>
        {/* <small>{message.date.toDate()}</small> */}
      </div>
      <div className="messageContent">
        <p>{handleDecrypt(message.text)}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;