import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import SignUpPage from '../pages/SignUpPage.jsx';
import toast from 'react-hot-toast';

export const useAuthStore = create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    isSigningIn:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[], 


    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/user/profile")
            set({authUser:res.data})
        } catch (error) {
            console.log("Error in checking auth",error);
            
            set({authUser:null})
        }finally {
            set({isCheckingAuth:false})
        }
    },
    signup:async (data)=>{
        set({isSigningIn:true})
        try {
            const res = await axiosInstance.post("/user/register",data)
            set({authUser:res.data})
            toast.success("Account created successfully")
        } catch (error) {
            console.log("Error in signing up",error);
        }finally {
            set({isSigningIn:false})
        }
    },
    logout:async ()=>{
        try {
            await axiosInstance.post("/user/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
        } catch (error) {
            console.log("Error in logging out",error);
        }
    },
    login:async (data)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/user/login",data)
            set({authUser:res.data})
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error("Invalid email or password")
            console.log("Error in logging in",error);
        }finally {
            set({isLoggingIn:false})
        }
    },
    updateProfile:async (data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/user/update-profile",data)
            set({authUser:res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("Error in updating profile",error);
        }finally {
            set({isUpdatingProfile:false})
        }
    },
}))