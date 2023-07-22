import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  // console.log(message)
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

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
    >
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
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;