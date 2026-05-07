import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// 1. IMPORT THE PROVIDER
import { AuthProvider } from './context/AuthContext' 

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      
      {/* 2. WRAP THE APP WITH THE PROVIDER */}
      <AuthProvider>
        <App />
      </AuthProvider>
      
    </BrowserRouter>
  </StrictMode>,
)