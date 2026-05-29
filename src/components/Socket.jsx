import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { io } from "socket.io-client";

function Socket() {
  useEffect(()=>{
    let socketConnaction = io('ws://localhost:5000',{auth:{token:localStorage.getItem('authentication-token')}});
    socketConnaction.connect();
    socketConnaction.on('users', (data)=>{
      toast(`${data.data.title} : ${data.data.content}`)
      toast('You have an reminder for payment')
    })
    socketConnaction.emit('register-user')
  },[])
  return (
    <Toaster position="top-right"/>
  )
}

export default Socket