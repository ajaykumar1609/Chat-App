import {React, useRef, useState} from "react";
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import Stories from "./Stories";

const Sidebar = ({ openStories }) => {
  // const [showStories, setShowStories] = useState(false);

  // const toggleStories = () => {
  //   setShowStories(!showStories);
  // };
  return (
    <div>
      <div className="sidebar">
      <Search/>
      <Chats/>
      {/* <StoriesOverlay show={showStories} onClose={toggleStories} /> */}
    </div>
    <div className="s-navbar">
      <Navbar openStories={openStories}/>
      {/* <button onClick={toggleStories}>View Stories</button> */}
      {/* <Stories style={{display: None}} ref={storiesRef} /> */}
    </div>
    </div>
    
  );
};

export default Sidebar;