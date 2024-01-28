import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Navbar from './component/Navbar';
import IndexPage from './page/IndexPage';
import ProfilePage from './page/ProfilePage';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import PostPage from './page/PostPage';
import Loading from './component/Loading';
import { useContext, useEffect } from 'react';
import { authContext } from './contexts/AuthContextProvider';
import { loadingContext } from './contexts/LoadingContextProvider';


function App() {
  const { status } = useContext(authContext);
  const { isLoading } = useContext(loadingContext);

  

  return (<>
    {
    status === 'USER' &&
    <BrowserRouter>
      {isLoading && <Loading/>}
      <Navbar/>
      <Routes>
        <Route path='/explorer' element={<IndexPage/>}/>
        <Route path='/:name' element={<ProfilePage/>}/>
        <Route path='/post/:id' element={<PostPage/>}/>
        <Route path='*' element={<Navigate to={'/explorer'}/>}/>
      </Routes>
    </BrowserRouter> 
    }

    {
    status === 'GUEST' &&
    <BrowserRouter>
      {isLoading && <Loading/>}
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='*' element={<Navigate to={'/login'}/>}/>
      </Routes>
    </BrowserRouter> 
    } 
    </>
  )
}

export default App
