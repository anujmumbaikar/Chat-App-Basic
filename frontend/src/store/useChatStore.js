import {create} from 'zustand';
import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js'
import {useAuthStore} from './useAuthStore.js'

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUserChat:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers:async()=>{
        set({isUsersLoading:true})
        try {
            const res = await axiosInstance.get('/message/chat-users')
            set({users: res.data.data})
        } catch (error) {
            toast.error('Error fetching users')
        } finally {
            set({isUsersLoading:false})
        }
    },
    getMessages:async (userId)=>{
        set({isMessagesLoading:true})
        try {
            const {data} = await axiosInstance.get(`/message/${userId}/messages`)
            set({messages:data.data})
        } catch (error) {
            toast.error('Error fetching messages')
        } finally {
            set({isMessagesLoading:false})
        }
    },
    sendMessage:async (data)=>{
        const {selectedUserChat,messages} = get()
        try {
            const res = await axiosInstance.post(`/message/${selectedUserChat._id}/send-message`,data);
            set({messages:[...messages,res.data.data]})
        } catch (error) {
            toast.error('Error sending message')
        }
    },
    subscribeToMessages: () => {
        const {selectedUserChat} = get();
        if(!selectedUserChat) return;
        const socket = useAuthStore.getState().socket;
        socket.off("message"); // clean up first
        
        socket.on('message',(newMessages)=>{
            if(newMessages.sender !== selectedUserChat._id){
                return;
            }
            set({
                messages:[...get().messages,newMessages]
            })
        })
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("message");
      },
    //optimize later
    setSelectedUserChat:(selectedUserChat)=> set({selectedUserChat})
}))