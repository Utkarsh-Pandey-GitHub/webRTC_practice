"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client" 

const SocketContext = createContext(null)



export function useSocket(){
    const Connect =useContext(SocketContext)
    return Connect
}

const baseURL = process.env.NODE_ENV === "production" ? "https://webrtc-practice-2.onrender.com" : "http://localhost:4000"
export function SocketProvider({ children }: {
    children: React.ReactNode
}) {
    
    const socket = io(baseURL)
    const configuration:RTCConfiguration = {'iceServers':[{'urls':'stun:stun.l.google.com:19302'}]}
    const [RTCpeer,setRTCpeer] = useState<RTCPeerConnection|any>()
    useEffect(()=>{ 
        const RTCPeer:RTCPeerConnection = new RTCPeerConnection(configuration)
        setRTCpeer(RTCPeer)
    },[])
    
    return (
        <SocketContext.Provider value={{socket,RTCpeer} as any}>
            {children}
        </SocketContext.Provider>
    )
}

