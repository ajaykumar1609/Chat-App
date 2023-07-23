import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import CryptoJS from 'crypto-js';
// import JSEncrypt from 'jsencrypt';

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  // Function to handle decryption
  const handleDecrypt = (t,c1,c2) => {
    console.log(t,getChatId(c1,c2));
    const bytes = CryptoJS.AES.decrypt(t, getChatId(c1,c2));
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // setDecryptedMessage(decrypted);
    return decrypted
  };

  function getChatId(userUid1, userUid2) {
    // Sort the uids to ensure consistent chat ID regardless of the order
    const sortedUids = [userUid1, userUid2].sort();
  
    // Concatenate the sorted uids to form the chat ID
    const chatId = sortedUids.join('');
  
    // return chatId;
    return userUid1 > userUid2
                    ? userUid1 + userUid2
                    : userUid2 + userUid1
  }

  useEffect(() => {
    const getChats = async () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        console.log(chats);
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);


  const handleSelect = (u) => {
    console.log(u)
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
        {chat[1].userInfo && chat[1].userInfo.photoURL && (
              <img src={chat[1].userInfo.photoURL} alt="" />
            )}
          {/* <img src={chat[1].userInfo.photoURL} alt="" /> */}
          <div className="userChatInfo">
            <span>{chat[1].userInfo?.displayName}</span>
            {chat[1].lastMessage && <p>{handleDecrypt(chat[1].lastMessage.text,chat[1].userInfo.uid,currentUser.uid)}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;