import React, { useContext, useState } from 'react'
import { collection, query, where, getDocs, setDoc,updateDoc,doc,serverTimestamp,getDoc,orderBy, startAt, endAt } from "firebase/firestore";
import {db} from "../firebase"
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../context/AuthContext';
const Search = () => {
  const [userName,setUserName] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // const [user,setUser] = useState(null)
  const [err,setErr] = useState(false)
  const {currentUser} = useContext(AuthContext)
  const [filteredUsers, setFilteredUsers] = useState([]);

  

  const handleSearch = async () => {
    // setUserName(e);
    // console.log(userName);
    // console.log("ss");
    const q = query(
      collection(db, "users"),
      where("displayName", ">=", userName),
      where("displayName", "<=", userName + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const results = [];

    try {
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
        // console.log(results);
      });
      setFilteredUsers(results);
      setErr(false);
    } catch (err) {
      setErr(true);
    }
  };


  const handleSelect = async (user) => {
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

    // setUser(null);
    setUserName("")
    setFilteredUsers([]);
    
  };
  const handleKey = e =>{
    // handleSearch();
    e.code === "Enter" && handleSearch();
  };
  return (
    <div className="search">
      <div className={`searchForm ${isSearchFocused ? 'start' : 'center'}`}>
        <SearchIcon fontSize="small"/>
        <input
          type="text"
          placeholder="Search"
          onFocus={()=>setIsSearchFocused(true)}
          onBlur={()=>setIsSearchFocused(false)}
          onKeyDown={handleKey}
          onChange={(e) => setUserName(e.target.value)}
          // onChange={(e) => handleSearch(e.target.value)}
          value={userName}
        />
      </div>
      {err && <span>User not found</span>}
      {userName && filteredUsers.map((user) => (
        <div key={user.uid} className="userChat" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );  
}

export default Search