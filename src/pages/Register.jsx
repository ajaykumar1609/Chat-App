import React, { useState, useRef } from "react";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {auth,db,storage} from "../firebase"
import { doc, setDoc,getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/chatapplogo-transformed.png"
import googleicon from "../img/googleicon.png"
import defaultImg from "../img/defaultpic.webp"
// import "./Login.scss";
// import {DriveFolderUploadOutlined} from '@mui/icons-material';
const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [t_file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const navigate = useNavigate();


  // const defaultAvatar = {dp};
  // const handleClick = ()=>{
  //   setLoading(true);
  // };
  // const selectedFile = null;
  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile);
  // };
  // const fileInputRef = useRef(null); // Create a ref for the file input
  // const handleRemove = () => {
  //   setFile(null); // Reset the file state to null to remove the selected image
  // };
  // const handleRemove = () => {
  //   setFile(null); // Reset the file state to null to remove the selected image
  //   // Clear the file input value to allow selecting the same file again
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };
  
  const handleSubmit = async (e) =>{
    e.preventDefault()
    setLoading(true);
    setErr(false);
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    // var file = e.target[3].files[0];
    // console.log(t_file)
    // if (t_file){
    //   file = t_file;
    // }
    // console.log(file);
    // if (!file){
    //   file = defaultAvatar;
    // }
    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            // await setDoc(doc(db, "userMessages", res.user.uid), {});
            // Create empty user stories on Firestore
            await setDoc(doc(db, "userStories", res.user.uid), {});
            await setDoc(doc(db, "userFriends", res.user.uid), {});
            navigate("/");

          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
        });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

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
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          {/* <h3 className="registerLogo">FaceBook</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on Facebook.
          </span> */}
          <img src={logo}/>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <div className="top">
              <img
                src={
                  img
                    ? URL.createObjectURL(img)
                    : defaultImg
                }
                alt=""
                className="profileImg"
              />
              <div className="formInput">
                <label htmlFor="file">
                {/* <UploadFileOutlinedIcon/> */}
                  {/* Image: <DriveFolderUploadOutlined className="icon"/> */}
                  {/* Image: <UploadFileOutlinedIcon className="icon" /> */}
                  Image: <img src={googleicon}/>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".png,.jpeg,.jpg"
                    className="icon"
                    style={{ display: "none" }}
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            <div className="bottom">
              <form onSubmit={handleSubmit} className="bottomBox">
                <input
                  type="text"
                  placeholder="Name"
                  id="displayName"
                  className="registerInput"
                  // required
                />
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="registerInput"
                  // required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="registerInput"
                  minLength={6}
                  // required
                />
                {/* <input
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPasword"
                  className="registerInput"
                  required
                /> */}
                <button type="submit" className="registerButton">
                  Sign Up
                </button>
                {/* <button onClick={handleGoogleSignIn}>google sign in</button> */}
                <Link to="/login">
                  <button className="loginRegisterButton">
                    Log into Account
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

export default Register