import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import PostArea from './pages/PostArea'
import MyProfile from './MyProfile/MyProfile'
import EditProfile from './MyProfile/EditProfile'
import UserProfile from './Users/UserProfile.jsx'
import Chat from './chat/Chat.jsx'
import SavedPosts from './pages/SavedPosts.jsx'
import Settings from './pages/Settings.jsx'
import Explore from './pages/Explore.jsx'
import AboutApp from './pages/AboutApp.jsx'
import Notifications from './pages/Notifications.jsx'

// CHANGE 1: Import your new AuthModal component
import AuthModal from './components/Auth/AuthModal' 

function App() {
  return (
    <div className="bg-[#050c1a] min-h-screen text-[#f0f2f8] font-sans overflow-x-hidden">
      
      <Navbar/>

      {/* CHANGE 2: Add the Modal here. It will stay invisible until Context tells it to open! */}
      <AuthModal /> 
      
      {/* Main Layout Wrapper */}
      <div className="flex pt-[85px]">
        
        {/* Sidebar */}
        <Sidebar/>
        
        {/* Main Content Area */}
        <main className="flex-1 px-6 ml-[250px]">
          <Routes>
            <Route path="/" element={<div className=""><PostArea/></div> } />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path='/editProfile' element={<EditProfile/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/saved' element={<SavedPosts/>}/>
            <Route path='/setting' element={<Settings/>}/>
            <Route path='/explore' element={<Explore/>}/>
            <Route path='/aboutApp' element={<AboutApp/>}/>
            <Route path='/notifications' element={<Notifications/>}/>
            <Route path='/user/:username' element={<UserProfile/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App