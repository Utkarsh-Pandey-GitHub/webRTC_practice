"use client"
import { createContext, useContext } from "react"
import { io } from "socket.io-client" 

const SocketContext = createContext(null)



export function useSocket(){
    const socket =useContext(SocketContext)
    return socket
}

const baseURL = process.env.NODE_ENV === "production" ? "https://webrtc-practice-2.onrender.com" : "http://localhost:4000"
export function SocketProvider({ children }: {
    children: React.ReactNode
}) {
    const socket = io(baseURL)
    return (
        <SocketContext.Provider value={socket as any}>
            {children}
        </SocketContext.Provider>
    )
}

