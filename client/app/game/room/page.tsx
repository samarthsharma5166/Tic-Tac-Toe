'use client'
import Game from "@/components/Game/Game";
import GameRoom from "@/components/Game/GameRoom"
import { useSocket } from "@/hooks/useSocket";
import { useState } from "react"

export interface Room{
    name:string,
    roomName:string | null,
    isPrivate:boolean | null
    roomCode:string
}

const page = () => {
    const[room,setRoom] = useState(false);
    const {socket,loading} = useSocket(); 
    const [roomData,setRoomData] = useState<Room>();
  return (
    <div>
        {!room && <GameRoom socket={socket!} loading={loading} setRoom={setRoom} setData={setRoomData}/>}
       {room && <Game roomCode={roomData?.roomCode!} socket={socket!} name={roomData?.name!} />}
    </div>
  )
}

export default page