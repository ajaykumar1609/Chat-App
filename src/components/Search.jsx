import React, { useContext, useState } from 'react'
import { collection, query, where, getDocs, setDoc,updateDoc,doc,serverTimestamp,getDoc } from "firebase/firestore";
import {db} from "../firebase"
import { AuthContext } from '../context/AuthContext';
const Search = () => {
  const [userName,setUserName] = useState("")
  const [user,setUser] = useState(null)
  const [err,setErr] = useState(false)
  const {currentUser} = useContext(AuthContext)

  const handleSearch = async () =>{
    const q = query(collection(db,"users"), where("displayName", "==", userName));
    const querySnapshot = await getDocs(q);
    try{
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data())
        // console.log(doc.id, " => ", doc.data());
      });
    }catch(err){
      setErr(true);
    }
    
    }
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //there is not chat between them so create a document with combined id in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUserName("")
  };
  const handleKey = e =>{
    e.code === "Enter" && handleSearch();
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input type='text' placeholder='find a user' onKeyDown={handleKey} onChange={e => setUserName(e.target.value) } value={userName}/>
      </div>
      {err && <span>User not found</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt=''/>
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search