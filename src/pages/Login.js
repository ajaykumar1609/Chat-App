import React, { useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc,getDoc } from "firebase/firestore";
import googleicon from "../img/googleicon.png"
import {auth,db,storage} from "../firebase"
import logo from "../img/chatapplogo-transformed.png"
// import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const handleClick = ()=>{
  //   setLoading(true);
  // };
  const handleSubmit = async(e)=>{
    setLoading(true);
    setErr(false);
    e.preventDefault()
    const email = e.target[0].value;
    const password = e.target[1].value;
    try{
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/");
    }catch (err) {
      setErr(true);
      setLoading(false);
    } 
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
  
      // Check if the user already exists in the "users" collection
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (!userDocSnapshot.exists()) {
        // If the user does not exist, create a new user document
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName,
          email,
          photoURL,
        });
  
        // create empty user chats on firestore
        await setDoc(doc(db, "userChats", user.uid), {});
        // await setDoc(doc(db, "userMessages", user.uid), {});
        // Create empty user stories on Firestore
        await setDoc(doc(db, "userStories", user.uid), {});
        await setDoc(doc(db, "userFriends", user.uid), {});
      }
  
      // Redirect the user to the desired page after successful sign-in
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Handle any error or show error messages
    }
  };
  return (
    // <div className="formContainer">
    //     <div className="formWrapper">
    //     <span className='logo'>Chat App</span>
    //     <span className='title'>Login</span>
    //     <FontAwesomeIcon icon="fa-solid fa-envelope" />
    //     <form onSubmit={handleSubmit}>
    //         <input type='email' placeholder='email'/>
    //         <input type='password' placeholder='password'/>
    //         {!loading && <button>Sign in</button>}
    //         {loading && <button>Logging in</button>}
    //         {/* {loading && <button className='loading-stuck'>stuck? sign in</button>} */}
    //         {err && <span>Something went wrong</span>}
    //     </form>
    //     <p>You don't have an account? <Link to="/register">Register</Link></p>
    //     </div>
    // </div>
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          {/* <h3 className="loginLogo">Chat App</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Chat App.
          </span> */}
          <img src={logo}/>
        </div>
        <div className="loginRight">
          <div className="loginBox" >
            <div className="bottom">
              <form onSubmit={handleSubmit} className="bottomBox">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="loginInput"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="loginInput"
                  minLength={6}
                  required
                />

                {/* <button type="submit" className="loginButton">
                  Sign In
                </button> */}
                {!loading && <button className="loginButton">Sign in</button>}
                {loading && <button className="loginButton">Logging in</button>}
                {loading && <button className='loading-stuck'>stuck? sign in</button>}
                <div className='googleSignIn'>
                  <img src={googleicon} style={{height: 25}}/><button onClick={handleGoogleSignIn}>Continue with Google</button>
                </div> 
                <Link to="/register">
                  <button className="loginRegisterButton">
                    Create a New Account
                  </button>
                </Link>
                
                {err && <span>Something went wrong</span>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

