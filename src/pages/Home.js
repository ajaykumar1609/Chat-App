import React, { useContext, useEffect, useState } from 'react'
import Sidebar from "../components/Sidebar"
import Chat from "../components/Chat"
import Stories from '../components/Stories'
import { ChatContext } from '../context/ChatContext'
const Home = () => {
  const { data } = useContext(ChatContext);
  const [isChatSelected, setChatSelected] = useState(false);
  useEffect(() => {
    // Check the condition here
    if (data.chatId === "ajay") {
      // Don't request until the condition is met
      return;
    }
    setChatSelected(true);
  }, [data.chatId]);
  return (
    <div className="home">
        {/* <div className={`container${isChatSelected ? 'mobile' : ''}`}>
        <Sidebar/>
        <Chat onUnselectChat={()=>{setChatSelected(false)}}/>
        </div> */}
        <div className="container">
          <Sidebar/>
          <Chat/>
          
        </div>
        {/* {showStories && (
        <Stories onClose={closeStories} />
      )} */}
    </div>
  )
}

export default Home