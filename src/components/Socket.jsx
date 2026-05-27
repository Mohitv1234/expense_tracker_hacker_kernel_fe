import React, { useEffect } from 'react'
import { io } from "socket.io-client";

function Socket() {
  useEffect(()=>{
    let socketConnaction = io('ws://localhost:5000',{auth:{token:localStorage.getItem('authentication-token')}});
    socketConnaction.connect();
    socketConnaction.on('users', (data)=>{
        console.log(data);
        
    })
  },[])
  return (
    <div>Socket</div>
  )
}

export default Socket