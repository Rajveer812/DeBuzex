import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import PostArea from './pages/PostArea'
import MyProfile from './MyProfile/MyProfile'
import EditProfile from './MyProfile/EditProfile'

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
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App