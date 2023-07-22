import React, { useContext } from 'react'
import more from "../img/viewmore_104374.png"
import Messages from './Messages'
import Input from "./Input"
import { ChatContext } from '../context/ChatContext'
const Chat = () => {
  const {data} = useContext(ChatContext)
  if (data.chatId == "ajay"){
    return(
      <div className='chatAjay'>
          <div className="message-text">Your Message Here</div>
      </div>
    )
  }
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <img src={more} alt="" />
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat