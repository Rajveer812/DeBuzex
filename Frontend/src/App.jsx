import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import PostArea from './pages/PostArea'
import MyProfile from './MyProfile/MyProfile'

function App() {

  return (
    <div className="bg-[#0d0f14] min-h-screen text-[#f0f2f8] font-sans overflow-x-hidden">
      
      <Navbar/>
     {/* Main Layout Wrapper */}
      <div className="flex pt-[10px]">
        
        {/* Sidebar */}
        <Sidebar/>
        {/* Main Content Area: Notice how the margin-left changes dynamically based on the state! */}
        <main className="flex-1 px-6 ml-[250px]">
          <Routes>
            <Route path="/" element={<div className=""><PostArea/></div> } />
            <Route path="/myProfile" element={<MyProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
