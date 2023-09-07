import React, { useState, useContext,useEffect } from 'react'
import {
  arrayUnion,
  doc,
  getDocs,
  setDoc,
  getDoc,
  collection,

} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable,deleteObject } from "firebase/storage";
import { AuthContext } from '../context/AuthContext';
import "./Stories.scss"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
const Stories = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [stories, setStories] = useState(null);
  const [textStory, setTextStory] = useState("");
  const {currentUser} = useContext(AuthContext);
  // const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [view,setView] = useState(null);
  const [ownStory,setOwnStory] = useState(null);
  const [showUploadOptions,setShowUploadOptions] = useState(false);
  const [u,setU] = useState(false);

  // Function to delete old stories older than 24 hours
  const autoDeleteOldStories = async () => {
    try {
      // Get the current timestamp and calculate the timestamp for 24 hours ago
      const now = new Date().getTime();
      const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

      // Get the userStories document for the current user
      const userStoriesDoc = doc(db, "userStories", currentUser.uid);
      if (!userStoriesDoc){
        return;
      }
      const userStoriesSnapshot = await getDoc(userStoriesDoc);
      if (!userStoriesSnapshot.exists()) {
        return;
      }

      // Filter and delete old stories
      const storiesData = userStoriesSnapshot.data().stories || [];
      // console.log(storiesData);
      const updatedStories = storiesData.filter(story => story.timestamp >= twentyFourHoursAgo);
      // console.log(updatedStories)

      // Delete old stories from Firebase Storage
      const oldStories = storiesData.filter(story => story.timestamp < twentyFourHoursAgo);
      oldStories.forEach(story => {
        const fileName = `stories/${currentUser.uid}/${story.timestamp}`;
        const fileRef = ref(storage, fileName); // Create a reference to the file in storage
        deleteObject(fileRef).then(() => {
          console.log("Old story deleted from storage:", fileName);
        }).catch(error => {
          console.error("Error deleting old story from storage:", error);
        });
      });

        
      // If any old stories were deleted, update the userStories document
      if (storiesData.length !== updatedStories.length) {
        await setDoc(userStoriesDoc, { stories: updatedStories });
      }
    } catch (error) {
      console.error("Error auto-deleting old stories:", error);
    }
  };

  // useEffect hook to auto-delete old stories every hour (adjust the interval as needed)
  useEffect(() => {
    if (currentUser){autoDeleteOldStories(); // Initial call on component mount
    const interval = setInterval(() => {
      autoDeleteOldStories(); // Call every hour (adjust the interval as needed)
    }, 3600000); // 1 hour in milliseconds

    return () => clearInterval(interval);} // Clean up the interval on component unmount
  }, [currentUser]);

  const handleOwnUserClick = () => {
    // Logic to handle clicking on user's story
  
    // For now, let's assume you want to toggle a state to show/hide upload options
    setShowUploadOptions((prev) => !prev);
  };

  // Function to handle story upload
  const handleStoryUpload = async (storyType) => {
    console.log(storyType);
    const date = new Date().getTime();

    if (storyType === "image" && story) {
      // console.log("a")
      // Upload the image story to Firebase Storage
      try {
        // Upload the image story to Firebase Storage
        const storageRef = ref(storage, `stories/${currentUser.uid}/${date}`);
        await uploadBytesResumable(storageRef, story);
    
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
    
        // Add the image story data to the userStories collection
        // console.log("b");
        await setDoc(doc(db, "userStories", currentUser.uid), {
          stories: arrayUnion({
            id: currentUser.uid,
            name: currentUser.displayName,
            type: "image",
            content: downloadURL,
            timestamp: date,
          }),
        });
      } catch (error) {
        console.error("Error uploading image story:", error);
      }
      ;
    } else if (storyType === "text" && textStory) {
      // Add the text story data to the userStories collection
      await setDoc(doc(db, "userStories", currentUser.uid), {
        stories: arrayUnion({
          id: currentUser.uid,
          name: currentUser.displayName,
          type: "text",
          content: textStory,
          timestamp: date,
        }),
      });
    }
    setStory(null);
    setTextStory("");
    // Wait for a short delay (e.g., 100 milliseconds) before refreshing
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  // Function to get the list of friends from the "userFriends" collection
  const getFriendsList = async () => {
    try {
      const userFriendsDoc = await getDoc(doc(db, "userFriends", currentUser.uid));
      if (userFriendsDoc.exists()) {
        return userFriendsDoc.data().friends || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting friends list:", error);
      return [];
    }
  };


  // Function to get stories of users the current user has chatted with
  const getFilteredStories = async () => {
    try {
      // Get the list of friends from the "userFriends" collection
      const friendsList = await getFriendsList();
      // console.log(friendsList);

      // Query the "userStories" collection to fetch all stories
      const storiesSnapshot = await getDocs(collection(db, "userStories"));
      const filteredStories = [];
      // console.log(storiesSnapshot)

      // Filter out stories whose user ID matches the friends list
      storiesSnapshot.forEach((storyDoc) => {
        const storyData = storyDoc.data();
        // console.log(storyData);
        if(!storyData?.stories){
          return filteredStories;
        }
        if (friendsList.includes(storyData?.stories[0]?.id)) {
          console.log("Story added:", storyData.stories[0].id);
          filteredStories.push({
            id: storyDoc.id,
            date: storyData.stories[0].timestamp,
            ...storyData,
          });
        }
      });
      const sortedStories = filteredStories.slice().sort((a, b) => b.date - a.date);
      return sortedStories;
    } catch (error) {
      console.error("Error getting filtered stories:", error);
      return [];
    }
  };

  // Function to get the current user's own stories
  const getOwnStories = async () => {
    try {
      
      // console.log(currentUser.uid);
      const userStoriesDoc = doc(db, "userStories", currentUser.uid);
      const userStoriesSnapshot = await getDoc(userStoriesDoc);
      // console.log(userStoriesSnapshot);
      if (userStoriesSnapshot.exists()) {
        return userStoriesSnapshot.data() || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting own stories:", error);
      return [];
    }
  };
  const displayStories = async () => {
    try {
      // Get the filtered stories from friends
      const filteredStories = await getFilteredStories();
      // console.log("aaa");
      // console.log(filteredStories);
      if (filteredStories){
        // console.log("bbb");
      }
      setStories(filteredStories);
      
  
      // Get the current user's own stories
      const ownStories = await getOwnStories();
      // console.log(ownStories);
      if (ownStories && ownStories.stories && ownStories.stories.length > 0) {
        setOwnStory(ownStories);
      }
    } catch (error) {
      console.error("Error displaying stories:", error);
    }
  };
  
  // const handleStoryView = ()=>{
  //   displayStories();
  // }
  const handleStoryClick = (e)=>{
    setView(null);
    setU(false);
    if (e){
      setView(e);
    }
  }
  const handleOwnStoryClick = (e)=>{
    // console.log("hjhh");
    // console.log(ownStory);
    // console.log(e);
    setView(null);
    setU(true);
    setShowUploadOptions(false);
    if (e){
      // console.log(e)
      setView(e);
      // console.log(view.stories[0]);
    }
  }
  // displayStories();
  useEffect(()=>{
    displayStories();
  },[currentUser.uid])

  return (
    <div className='stories'>
      {/* Render a button to trigger story display */}
      {/* <button onClick={displayStories}>View Stories</button> */}

      {/* <div>
        <input type="file" onChange={(e) => setStory(e.target.files[0])} />
        <button onClick={() => handleStoryUpload("image")}>Upload Image Story</button>

        <input type="text" value={textStory} onChange={(e) => setTextStory(e.target.value)} />
        <button onClick={() => handleStoryUpload("text")}>Upload Text Story</button>
        <button onClick={handleStoryView}>View Story</button>
      </div> */}

      <div className='storySidebar'>
          <div className='top-bar'>
            <button onClick={() => navigate("/")}>
              <ArrowBackIosNewIcon/>
            </button>
          </div>
          <div className='userStory' onClick={() => handleOwnStoryClick(ownStory)}>
            {ownStory && ownStory.stories[0].type === 'image' && (
              <img
                style={{ height: 30, width: 30, borderRadius: 15 }}
                src={ownStory.stories[0].content}
                alt="Story"
              />
            )}
            {ownStory && ownStory.stories[0]?.type === 'text' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: '#f2f2f2',
                  textAlign: 'center',
                }}
              >
                <p>{ownStory.stories[0].content}</p>
              </div>
            )}
            {!ownStory && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: 'black',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '80%', // Adjust width as needed
                    height: '80%', // Adjust height as needed
                    backgroundColor: 'white',
                    borderRadius:15,
                  }}
                ></div>
              </div>
            )}
            <div className="userChatInfo">
                <span>{currentUser.displayName}</span>
            </div>
          </div>
      {stories && stories.map((story) => (
          <div
            // className={`storyItem ${/* Add your logic to determine if this story is selected */}`}
            className='userStory'
            key={story.id}
            onClick={() => handleStoryClick(story)}
          >
            {story.stories[0].type === 'image' && (
              <img style={{ height: 30, width: 30, borderRadius:15 }} src={story.stories[0].content} alt="Story" />
            )}
            {story.stories[0].type === 'text' && <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: '#f2f2f2',
                textAlign: 'center',
              }}
            >
              <p>{story.stories[0].content}</p>
            </div>}
            <div className="userChatInfo">
              <span>{story.stories[0].name}</span>
          </div>
          </div>
        ))}
      </div>
      
      <div className='storyView'>
        {/* {view &&(
          <div className='background-image' style={{ backgroundImage: `url(${view.stories[0].content})` }} />
        )}
        {view &&(
          <img src={view.stories[0].content} className='main-image' alt='story' />
        )} */}

        {view && (
          <div className='background-image' style={{ backgroundImage: `url(${view.stories[0].content})` }} />
        )}
        {view && (
          <div className='main-image'>
            {view.stories[0].type === 'image' && (
              <img src={view.stories[0].content} className='main-image' alt='story' />
            )}
            {view.stories[0].type === 'text' && (
              <div className='main-text'>
                <p>{view.stories[0].content}</p>
              </div>
            )}
          </div>
        )}
        {u && showUploadOptions ? (
          <div className='upload-options'>
            {/* Upload options UI */}
            <input type='file' onChange={(e) => setStory(e.target.files[0])} />
            <button onClick={() => handleStoryUpload('image')}>Upload Image Story</button>

            <input type='text' value={textStory} onChange={(e) => setTextStory(e.target.value)} />
            <button onClick={() => handleStoryUpload('text')}>Upload Text Story</button>
            {/* Add other upload options if needed */}
          </div>
        ) : null}

        {u && (
          <div className='upload-button'>
            <button onClick={handleOwnUserClick}>Upload Story</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stories