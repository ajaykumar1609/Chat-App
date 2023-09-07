import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style.scss"
import "./App.css"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Stories from "./components/Stories";
function App() {
  const {currentUser} = useContext(AuthContext)
  // console.log(currentUser)
  const ProtectedRoute = ({children})=>{
    if(!currentUser){
      return <Navigate to="/login"/>
    }
    return children
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element ={<ProtectedRoute><Home/></ProtectedRoute> }/>
          <Route path="login" element ={<Login/>}/>
          <Route path="register" element ={<Register/>}/>
          <Route path="stories" element={<Stories/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
