"use client"
import { Dispatch, SetStateAction, useState } from "react";
import { Home, Users, Key, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { Room } from "@/app/game/room/page";


// Schema for creating a room
const createRoomSchema = z.object({
    roomName: z.string().min(3, {
        message: "Room name must be at least 3 characters.",
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    isPrivate: z.boolean().default(false),
});

// Schema for joining a room
const joinRoomSchema = z.object({
    roomCode: z.string().min(4, {
        message: "Room code must be at least 4 characters.",
    }),
    name: z.string()
});

const GameRoom = ({ socket, loading, setRoom, setData }:{
    socket:WebSocket,
    loading:boolean,
    setRoom: Dispatch<SetStateAction<boolean>>
    setData: Dispatch<SetStateAction<Room | undefined>>
}) => {
    const navigate = useRouter();
    // const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("create");
    const [isPrivateRoom, setIsPrivateRoom] = useState(false);

    // Create room form
    const createForm = useForm<z.infer<typeof createRoomSchema>>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            roomName: "",
            name:"",
        },
    });

    // Join room form
    const joinForm = useForm<z.infer<typeof joinRoomSchema>>({
        resolver: zodResolver(joinRoomSchema),
        defaultValues: {
            roomCode: "",
            name: "",
        },
    });

    // Handler for creating a room
    const onCreateRoom = (values: z.infer<typeof createRoomSchema>) => {
        console.log("Creating room:", values);

        // Generate a random room code
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const res =socket?.send(JSON.stringify({
            type:"join",
            roomId:roomCode,
            name:values.name,
            roomName:values.roomName
        }))
        
        console.log(res);
        setData({...values,roomCode:roomCode});
        setRoom(true);
        toast(`
            title: Room Created!,
            description: Room ${values.roomName} created with code: ${roomCode},
        `);

        // Here you would typically connect to your backend service
        // For now, we'll just redirect to a dummy game page
        setTimeout(() => {
            // navigate.push(`/game/${roomCode}`);
            console.log(res);

        }, 1500);
    };

    // Handler for joining a room
    const onJoinRoom = (values: z.infer<typeof joinRoomSchema>) => {
        console.log("Joining room:", values);
        const res = socket?.send(JSON.stringify({
            type: "join",
            name: values.name,
            roomId:values.roomCode
        }))
        setRoom(true)
        setData({name:values.name,roomCode:values.roomCode,isPrivate:false,roomName:null});
        toast(`
            title: Joining Room,
            description: Connecting to room ${values.roomCode}...,
        `);

        // Here you would typically validate the room code with your backend
        // For now, we'll just redirect to a dummy game page
        setTimeout(() => {
            console.log(res);
            // navigate.push(`/game/${values.roomCode}`);
        }, 1500);
    };

    if (loading || !socket) {
        return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 ">TicTacToe Rooms</h1>
                    <p className="text-gray-300">Create or join a multiplayer game room</p>
                </div>

                <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="create" className="flex items-center gap-2 ">
                            <Home className="h-4 w-4" />
                            Create Room
                        </TabsTrigger>
                        <TabsTrigger value="join" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Join Room
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="create">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-white">Create a New Room</CardTitle>
                                <CardDescription>
                                    Set up a new game room and invite your friends.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...createForm}>
                                    <form onSubmit={createForm.handleSubmit(onCreateRoom)} className="space-y-4">
                                        <FormField
                                            control={createForm.control}
                                            name="roomName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white" >Room Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="My Awesome Game" className="text-gray-200" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Choose a fun name for your game room.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                                
                                            )}
                                        />

                                        <FormField
                                            control={createForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white" >Your Name</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="lucifer" className="text-gray-200" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Choose a fun name for your game room.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>

                                            )}
                                        />

                                        {/* <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="isPrivate"
                                                className="rounded-sm"
                                                checked={isPrivateRoom}
                                                onChange={(e) => {
                                                    setIsPrivateRoom(e.target.checked);
                                                    createForm.setValue("isPrivate", e.target.checked);
                                                }}
                                            />
                                            <Label htmlFor="isPrivate">Private Room</Label>
                                        </div>

                                        {isPrivateRoom && (
                                            <FormField
                                                control={createForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Room Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="Optional password" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Set a password to keep your room private.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )} */}

                                        <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                                            Create Room
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="join">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-white">Join an Existing Room</CardTitle>
                                <CardDescription>
                                    Enter a room code to join a game with friends.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...joinForm}>
                                    <form onSubmit={joinForm.handleSubmit(onJoinRoom)} className="space-y-4">
                                        <FormField
                                            control={joinForm.control}
                                            name="roomCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Room Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter room code" {...field} className="text-gray-200" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter the code provided by the room creator.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={joinForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Enter Your Name</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="lucifer" className="text-gray-200" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Choose a fun name for your game room.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" className="w-full mt-6 bg-pink-600 hover:bg-pink-700">
                                            Join Room
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                    <Button variant="ghost" onClick={() => navigate.push("/")} className="text-gray-300 hover:text-white">
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GameRoom;
