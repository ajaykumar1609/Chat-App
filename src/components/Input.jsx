import React, { useContext, useState } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SendIcon from '@mui/icons-material/Send';
import { red } from '@mui/material/colors';
import Img from "../img/cam.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import CryptoJS from 'crypto-js';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  getDoc,setDoc
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [imgPreview, setImgPreview] = useState(null);

  // Function to handle encryption
  const handleEncrypt = (t) => {
    const encrypted = CryptoJS.AES.encrypt(t, data.chatId).toString();
    // setEncryptedMessage(encrypted);
    return encrypted
  };
  // Function to handle image preview
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      // Create an object URL for image preview
      setImgPreview(URL.createObjectURL(file));
    }
  };

  // Function to remove image preview and reset image state
  const removeImagePreview = () => {
    setImg(null);
    setImgPreview(null);
  };

  const addUserToFriends = async (userId) => {
    try {
      // Check if the user ID exists in the "userFriends" collection under the current user
      const userFriendsDoc = await getDoc(doc(db, "userFriends", data.user.uid));
      
      if (!userFriendsDoc.exists()) {
        // If the document doesn't exist, create it with the "friends" property as an empty array
        await setDoc(doc(db, "userFriends", data.user.uid), { friends: [] });
      }
      
      const friendsArray = userFriendsDoc.data()?.friends || []; // Get the "friends" property or an empty array if it's not defined
      
      if (!friendsArray.includes(userId)) {
        // If the user ID is not present in the "friends" array, add it
        await updateDoc(doc(db, "userFriends", data.user.uid), {
          friends: arrayUnion(userId),
        });
      }
    } catch (error) {
      console.error("Error adding user to friends:", error);
    }
  };
  
  
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
    // Add the other user's UID to the "userFriends" collection under the current user
    // await addUserToFriends(data.user.uid);
    // Assuming `data.user.uid` contains the other user's ID
    setText("");
    setImg(null);
    setImgPreview(null);
    const otherUserId = currentUser.uid;

    // Call addUserToFriends and pass the other user's ID
    if (otherUserId) {
      try {
        await addUserToFriends(otherUserId);
      } catch (error) {
        console.error("Error adding user to friends:", error);
      }
    }


    

    // await updateDoc(doc(db, "userMessages", currentUser.uid), {
    //   [data.user.uid]: arrayUnion({
    //     uid: data.user.uid,
    //     text: handleEncrypt(text),
    //     date: serverTimestamp(),
    //   }),
    // });
    

    
  };


  const handleKey = e =>{
    e.code === "Enter" && handleSend();
  };
  if (data.chatId === "ajay") {
    return null;
  }
  return (
    <div className="input">
      {/* Show image preview */}
      {imgPreview && (
          <div className="img-preview">
            <img style={{height:20}} src={imgPreview} alt="Preview" />
            <button onClick={removeImagePreview}>Remove</button>
          </div>
        )}
      <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleImagePreview}
        />
        {!imgPreview && <label htmlFor="file">
          {/* <img src={Img} alt="" /> */}
          <CameraAltIcon sx={{color: red[600]}} className="cameraicon"/>
        </label>}
      <input
        type="text"
        placeholder="Message here..."
        // onChange={(e) => setText(e.target.value)}
        // onChange={handleText}
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKey}
        required
      />
      
      {text && <div className="send">
        {/* <img src={Attach} alt="" /> */}
        {/* <SendIcon sx={{color:red[600]}}/> */}
        <button onClick={handleSend}><SendIcon sx={{color:red[600]}}/></button>
      </div>}
    </div>
  );
};

export default Input;