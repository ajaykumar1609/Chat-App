import React, { useContext, useState } from "react";
import Img from "../img/cam.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import CryptoJS from 'crypto-js';
// import JSEncrypt from 'jsencrypt';
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

  // const encryptor = new JSEncrypt();

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  // var t = "";
  const handleText = (e)=>{
    // console.log(data.user);
    // encryptor.setPublicKey(data.user.puk);
    // t = encryptor.encrypt(e.target.value);
    setText(e.target.value);
  }
  // Function to handle encryption
  const handleEncrypt = (t) => {
    const encrypted = CryptoJS.AES.encrypt(t, data.chatId).toString();
    // setEncryptedMessage(encrypted);
    return encrypted
  };

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const handleSend = async () => {
    if (!(text || img)){
      return;
    }
    
    // console.log(data.user)
    if (!data.chatId) {
      // Chat ID is undefined or null, do not proceed with the updates.
      return;
    }

    // console.log(data);
    if (data.chatId==="ajay"){
      //don't send if there is any user
    }
    else if (img) {
      // const encryptedMessage = await encryptMessage(text, encryptionKey);
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          // Handle error during upload
          console.error("Error uploading image:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text :handleEncrypt(text),
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
          text :handleEncrypt(text),
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text :handleEncrypt(text),
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text :handleEncrypt(text),
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };


  // // Function to encrypt the message using the recipient's public key
  // const encryptMessage = (message) => {
  //   if (!data.keyPairs[data.chatId]?.privateKey) {
  //     // If the public key of the recipient is not available,
  //     // return the message as is or handle it as needed.
  //     return message;
  //   }

  //   const encryptor = new JSEncrypt();
  //   encryptor.setPublicKey(data.keyPairs[data.chatId].privateKey);
  //   return encryptor.encrypt(message);
  // };



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
        // onChange={(e) => setText(e.target.value)}
        onChange={handleText}
        value={text}
        onKeyDown={handleKey}
        required
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