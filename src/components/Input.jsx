import React, { useContext, useState } from "react";
import Img from "../img/cam.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
// import { encryptMessage } from "../encryptionUtils";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { generateKeyPair, encryptMessage, decryptMessage } from '../rsa-utils';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  // const { publicKey, privateKey } = generateKeyPair();
  // const encryptedMessage = encryptMessage('Hello, how are you?', publicKey);
  // const decryptedMessage = decryptMessage(encryptedMessage, privateKey);
  // console.log(decryptedMessage)

  // const key = Whisper.generateKeyPair();
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    // console.log(data.chatId)
    if (!data.chatId) {
      // Chat ID is undefined or null, do not proceed with the updates.
      return;
    }
  
    if (data.chatId==="ajay"){
      //don't send if there is any user
    }
    else if (img) {
      // const encryptedMessage = await encryptMessage(text, encryptionKey);
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };
  const handleKey = e =>{
    e.code === "Enter" && handleSend();
  };
  if (data.chatId === "ajay") {
    return null;
  }
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Message here..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKey}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;