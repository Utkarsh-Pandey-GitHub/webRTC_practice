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
    
    
    return (
        <SocketContext.Provider value={{socket,configuration} as any}>
            {children}
        </SocketContext.Provider>
    )
}

