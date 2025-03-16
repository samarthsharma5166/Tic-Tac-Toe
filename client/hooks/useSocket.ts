"use client"
import { useEffect, useState } from "react";

export function useSocket() {
    const [socket,setSocket] = useState<WebSocket | null>(null);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        console.log(process.env.NEXT_PUBLIC_WS_URL);
        if (!process.env.NEXT_PUBLIC_WS_URL) return;
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
        ws.onopen = () => {
            setSocket(ws);
            setLoading(false);
        }
    },[]);
    return {socket,loading};
}
