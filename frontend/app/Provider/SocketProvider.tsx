"use client"
import { createContext, useContext } from "react"
import { io } from "socket.io-client" 

const SocketContext = createContext(null)



export function useSocket(){
    const socket =useContext(SocketContext)
    return socket
}


export function SocketProvider({ children }: {
    children: React.ReactNode
}) {
    const socket = io("http://localhost:4000")
    return (
        <SocketContext.Provider value={socket as any}>
            {children}
        </SocketContext.Provider>
    )
}

