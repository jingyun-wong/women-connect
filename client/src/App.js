import React from 'react'
import Signup from './containers/Signup/signup';
import MenteeProfile from './containers/Profile/MenteeProfile';
import MentorProfile from './containers/Profile/MentorProfile';
import MenteeNetwork from './containers/Network/MenteeNetwork';
import MentorNetwork from './containers/Network/MentorNetwork';
import MessageHomePage from './containers/Chat/Message';
import Home from './containers/Home';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/navbar';
import Login from './containers/Signup/login';
import Message from './containers/Chat/IndividualChat';
import MainPage from './containers/Main_Page';
import Loading from './components/Loading';
import NetworkGraph from './components/networkGraph'
import Graph from './components/data';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="loading" element={<Loading/>}></Route>
        <Route path="/" exact element={<MainPage />}></Route>
        <Route path="/signup" exact element={<Signup />}></Route>
        <Route path="/login" exact element={<Login />}></Route>
        <Route path="/messagechat" exact element={[<Navbar/>,<MessageHomePage />]}></Route>
        <Route path="/message" exact element={[<Navbar/>,<Message />]}></Route>
        <Route path="/message/:id" exact element={[<Navbar/>,<Message />]}></Route>
        <Route path="/profile">
          <Route path="mentee" element={[<Navbar/>,<MenteeProfile />]}></Route>
          <Route path="mentor" element={[<Navbar/>,<MentorProfile />]}></Route>
          <Route path="mentor/:id" element={[<Navbar/>,<MentorProfile />]}></Route>
          <Route path="mentee/:id" element={[<Navbar/>,<MenteeProfile />]}></Route>
        </Route>
        <Route path="/home" element={[<Navbar/>,<Home />]}></Route>
        <Route path="/network" >
          <Route path="mentee/:searchItem" element={[<Navbar/>,<MenteeNetwork />]}></Route>
          <Route path="mentor" element={[<Navbar/>,<MentorNetwork />]}></Route>
        </Route>
        {/* <Route path="/graph" exact element={[<Graph />]}></Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;
