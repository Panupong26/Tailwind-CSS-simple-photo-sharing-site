import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContextProvider from './contexts/authContextProvider.jsx'
import LoadingContextProvider from './contexts/LoadingContextProvider.jsx'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <LoadingContextProvider>
        <App />
        <ToastContainer/>
      </LoadingContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
