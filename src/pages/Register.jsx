import React, { useState, useRef } from "react";
import add_image from "../img/add-image.png"
// import dp from "../img/defaultpic.webp"
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth,db,storage} from "../firebase"
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
// import {DriveFolderUploadOutlined} from '@mui/icons-material';
import { generateKeyPair, encryptMessage } from '../rsa-utils';
const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [t_file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const navigate = useNavigate();
  const { publicKey, privateKey } = generateKeyPair();
  // const defaultAvatar = {dp};
  // const handleClick = ()=>{
  //   setLoading(true);
  // };
  // const selectedFile = null;
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const fileInputRef = useRef(null); // Create a ref for the file input
  // const handleRemove = () => {
  //   setFile(null); // Reset the file state to null to remove the selected image
  // };
  const handleRemove = () => {
    setFile(null); // Reset the file state to null to remove the selected image
    // Clear the file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e) =>{
    e.preventDefault()
    // console.log(e)
    // console.log(e.target[0].value)
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
  return (
    // <div className="formContainer">
    //     <div className="formWrapper">
    //     <span className='logo'>Chat App</span>
    //     <span className='title'>Register</span>
    //     <form onSubmit={handleSubmit}>
    //         <input type='text' placeholder='display name'/>
    //         <input type='email' placeholder='email'/>
    //         <input type='password' placeholder='password'/>
    //         {/* <input style={{display:"none"}} type='file' id="file" onChange={handleFileChange}/> */}
    //         <input
    //         ref={fileInputRef}
    //         style={{ display: "none" }}
    //         type="file"
    //         id="file"
    //         onChange={handleFileChange}
    //         key={t_file ? t_file.name : ""} // Add a unique key based on the file name
    //       />
    //         {/* <label htmlFor='file'>
    //             <img src={add_image} alt=''/>
    //             <span>Add an avatar</span>
    //         </label> */}
    //       {t_file ? ( // Render the selected image if there's a file
    //         <div className="uploaded_img">
    //           <img src={URL.createObjectURL(t_file)} alt="Selected Avatar" />
    //           <button className="button_uploadimg" onClick={handleRemove}>Remove/Change</button>
    //         </div>
    //       ) : (
    //         <label htmlFor="file">
    //           <>
    //             <img src={add_image} alt="add" />
    //             <span>Add an avatar</span>
    //           </>
    //         </label>
    //       )}
    //         {!loading && <button>Sign in</button>}
    //         {loading && <button>Logging in</button>}
    //         {loading && <span>Uploading and compressing the image please wait...</span>}
    //         {err && <span>Something went wrong</span>}
    //     </form>
    //     <p>
    //       You already have an account? <Link to="/login">Login</Link>
    //     </p>
    //     </div>
    // </div>
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">FaceBook</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on Facebook.
          </span>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <div className="top">
              <img
                src={
                  img
                    ? URL.createObjectURL(img)
                    : "/assets/profileCover/DefaultProfile.jpg"
                }
                alt=""
                className="profileImg"
              />
              <div className="formInput">
                <label htmlFor="file">
                {/* <UploadFileOutlinedIcon/> */}
                  {/* Image: <DriveFolderUploadOutlined className="icon"/> */}
                  {/* Image: <UploadFileOutlinedIcon className="icon" /> */}
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".png,.jpeg,.jpg"
                    // className="icon"
                    // style={{ display: "none" }}
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
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="registerInput"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="registerInput"
                  minLength={6}
                  required
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