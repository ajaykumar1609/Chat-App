import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import CryptoJS from 'crypto-js';
import { db } from "../firebase";
import { doc, updateDoc,serverTimestamp,getDoc } from "firebase/firestore";

const Message = ({ message,messages }) => {
  // console.log(message)
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [senderName, setSenderName] = useState("");
   // Function to handle decryption
   const handleDecrypt = (t) => {
    try{
      const bytes = CryptoJS.AES.decrypt(t, data.chatId);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      // setDecryptedMessage(decrypted);
      return decrypted
    }
    catch(error){
      console.log("Error encrypting message",error)

    }
    
  };
  // Function to handle encryption
  const handleEncrypt = (t) => {
    const encrypted = CryptoJS.AES.encrypt(t, data.chatId).toString();
    // setEncryptedMessage(encrypted);
    return encrypted
  };
  useEffect(() => {
    const fetchSenderName = async () => {
      try {
        const userDocRef = doc(db, "users", message.senderId);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setSenderName(userData.displayName);
        } else {
          // Handle case where the sender's document does not exist
          setSenderName("Unknown User");
        }
      } catch (error) {
        console.error("Error fetching sender's name:", error);
        // Handle error condition, e.g., setSenderName("Error fetching name");
      }
    };
  
    fetchSenderName();
  }, [message.senderId]);
  
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
            text:handleEncrypt("deleted"), // Replace "deleted" with the variable or message content you want to show for the last message
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
// Function to convert Firebase Timestamp to a human-readable date and time string without seconds
  const formatDate = (timestamp) => {
    const dateObject = timestamp.toDate();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return {
        date: 'Today',
        time: dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return {
        date: 'Yesterday',
        time: dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } else {
      return {
        date: dateObject.toLocaleDateString(),
        time: dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
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
      {/* <div className="messageInfo"> */}
        {/* <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        /> */}
        {/* <small>{formatDate(message.date)}</small> */}
        {/* <small>{message.date.toDate()}</small> */}
      {/* </div> */}
      <div className="messageContent">
        {message.img && <img src={message.img} alt="" />}
        {/* <small>{senderName}</small> */}
        <p>{handleDecrypt(message.text)}</p>
        <small>{formatDate(message.date).date} {formatDate(message.date).time}</small>
        
      </div>
    </div>
  );
};

export default Message;