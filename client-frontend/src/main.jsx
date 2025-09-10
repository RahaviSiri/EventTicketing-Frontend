import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { AppContextProvider } from './context/AppContext.jsx'
import { HeaderProvider } from './context/HeaderContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <HeaderProvider>
        <App />
      </HeaderProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
