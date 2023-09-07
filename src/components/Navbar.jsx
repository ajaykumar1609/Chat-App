import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/chatapplogo-transformed.png"

import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
const Navbar = () => {
  const navigate = useNavigate();
  const {currentUser} = useContext( AuthContext)
  return (
    <div className='navbar'>
      <img src={logo} className='logo' />
      {/* <span className="logo">Chat App</span> */}
      <div className="user">
        <img src={currentUser.photoURL} alt=''/>
        <span>{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)}>logout</button>
        <button onClick={()=>navigate("/stories")}>View Stories</button>
      </div>
    </div>
  )
}

export default Navbar