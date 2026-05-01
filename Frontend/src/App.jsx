import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  

  return (
    <div className="bg-[#0d0f14] min-h-screen text-[#f0f2f8] font-sans">
      
      {/* We will place the <Navbar /> here soon so it shows on every page */}

      <main className="pt-[58px]"> {/* Padding top to account for your fixed navbar height */}
        <Routes>
          {/* We will add your actual routes here as we build the pages */}
          <Route path="/" element={<div className="p-8 text-center text-accent">DebugDash Foundation Ready...</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
