import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    // Check the condition here
    if (data.chatId === "ajay") {
      // Don't request until the condition is met
      return;
    }

    // This part will be executed when data.chatId !== "ajay"
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (   doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // console.log(messages);

  

  return (
    <div className="messages">
      {data.chatId === "ajay" ? (
        <div className="select-someone">
          Select someone to start a conversation
        </div>
      ) : (
        messages.map((m) => <Message message={m} messages={messages} key={m.id} />)
      )}
    </div>
  );
};

export default Messages;
