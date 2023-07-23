import React from 'react'
import Sidebar from "../components/Sidebar"
import Chat from "../components/Chat"
import Ed from "../components/ed"
const Home = () => {
  return (
    <div className="home">
        <div className="container">
        <Sidebar/>
        <Chat/>
        {/* <Ed /> */}
        </div>
    </div>
  )
}

export default Home