import {create} from 'zustand';
import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js'

export const useChatStore = create((set)=>({
    messages:[],
    users:[],
    selectedUserChat:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers:async()=>{
        set({isUsersLoading:true})
        try {
            const {data} = await axiosInstance.get('/message/chat-users')
            set({users:data.data})
        } catch (error) {
            toast.error('Error fetching users')
        } finally {
            set({isUsersLoading:false})
        }
    },
    getMessages:async (userId)=>{
        set({isMessagesLoading:true})
        try {
            const {data} = await axiosInstance.get(`/${userId}/messages`)
            set({messages:data})
        } catch (error) {
            toast.error('Error fetching messages')
        } finally {
            set({isMessagesLoading:false})
        }
    },
    //optimize later
    setSelectedUserChat:(selectedUserChat)=> set({selectedUserChat})
}))