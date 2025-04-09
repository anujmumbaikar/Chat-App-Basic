import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import {Routes, Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import {axiosInstance} from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
import { Navigate,Link,NavLink } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore()  
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  if(isCheckingAuth && !authUser){
    return (
      <span className="loading loading-dots loading-lg"></span>
    )
  }
  
  return (
    <>
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser? <HomePage/> : <Navigate to='/login'/>}/>
        <Route path='/register' element={!authUser ? <SignUpPage/> : <Navigate to='/login'/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to='/'/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser? <ProfilePage/> : <Navigate to='/login'/>}/>
      </Routes>
      <Toaster/>
    </div>
    </>
    
  )
}

export default App