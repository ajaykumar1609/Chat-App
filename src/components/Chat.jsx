import React, { useContext,useEffect,useState } from 'react'
import more from "../img/viewmore_104374.png"
import Messages from './Messages'
import Input from "./Input"
import { ChatContext } from '../context/ChatContext'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
const Chat = ({ onUnselectChat }) => {
  const {data} = useContext(ChatContext)
  const { dispatch } = useContext(ChatContext);
  const [sUser, selectUser] = useState(null);

  const handleSelect = () => {
    // selectUser("ajay");
    // console.log(u)
    dispatch({ type: "RESET"});
    // selectUser(null);
  };
  // useEffect(()=>{
  //   console.log(data);
  //   selectUser(null);
  // },[data.chatId])

  if (data.chatId == "ajay"){
    return(
      <div className='chatAjay'>
          <div className="message-text">Select a chat to start messaging</div>
      </div>
    )
  }
  return (
    <div className='chat'>
      <div className="chatInfo">
      <div className="chatn">
      {data.user.photoURL && <img src={data.user.photoURL} alt="" />}
        <span>{data.user.displayName}</span>
      </div>
      
        <div className="chatIcons">
          {/* <img src={more} alt="" /> */}
          <button onClick={handleSelect}><ArrowBackIosNewIcon/></button>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat