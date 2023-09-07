import { doc, onSnapshot, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  // const [otherUserMessages, setOtherUserMessages] = useState([]);
  // const fetchOtherUserMessages = async () => {
  //   // Get the document reference for the userMessages
  //   const userMessagesRef = doc(db, "userMessages", currentUser.uid);

  //   // Get the snapshot of the userMessages document
  //   const userMessagesSnapshot = await getDocs(userMessagesRef);

  //   // Extract the messages for the specific user (other user)
  //   const specificUserMessages = userMessagesSnapshot.data()?.[data.user.uid];
  //   return specificUserMessages || []
  //   // Set the messages for the other user to the state
  //   // setOtherUserMessages(specificUserMessages || []);
  // };
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
  // const msgs = messages.filter((m) => m.senderId !== currentUser.uid);

  

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
