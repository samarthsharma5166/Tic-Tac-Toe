import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Circle, ArrowLeft, Copy, RefreshCw } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner"
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { GameState } from "./GameState";

type Player = "X" | "O";
type BoardState = (Player | "")[][];
interface winner {
    winner:"X"|"O"|"DRAW",
    name:string
}
const Game = ({ roomCode,socket,name }: { roomCode :string,socket:WebSocket,name:string}) => {
    const navigate = useRouter();
    const [game, setGame] = useState<GameState | null>(null);
    const [players, setPlayers] = useState<number>(0);
    
    // Game state

    const [board, setBoard] = useState<BoardState>(() =>
        Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ""))
    );
    console.log(board)
    const [currentTurn, setCurrentTurn] = useState<Player>("X");
    const [winner, setWinner] = useState<winner | null>(null);
    const [playerSymbol, setPlayerSymbol] = useState<Player>("X");
    useEffect(()=>{
        const game = new GameState(socket,roomCode);
        setGame(game);
    }, [socket])

    useEffect(() => {
        if(game === null) return;
        game.setPlayersCallback(setPlayers);
        game.setBoardCallback(setBoard);
        game.setcurrentTurnCallback(setCurrentTurn);
        game.setWinnerCallback(setWinner);
        game.setPlayerSymbolCallback(setPlayerSymbol);
    }, [game]);
    
    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode || "");
        toast(`
            Room code copied!,
            Share this code with your friend to play together.,
        `);
    };

    const renderCell = (row: number, col: number) => {
        return (
            <div
                key={`${row}-${col}`}
                className={cn(
                    "aspect-square bg-gray-800 rounded-lg border-2 border-gray-700",
                    "flex items-center justify-center text-5xl font-bold cursor-pointer",
                    "transition-all duration-200 hover:bg-gray-700",
                    winner && "pointer-events-none"
                )}
                onClick={() =>game &&  game.handleCellClick(row,col)}
            >
                {board[row][col] === "X" && <X className="h-16 w-16 text-blue-500" />}
                {board[row][col] === "O" && <Circle className="h-16 w-16 text-pink-500" />}
            </div>
        );
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                {/* Room info */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Game Room</h1>
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-md">
                        <span className={cn("font-mono", players < 2 && "text-red-400")}>
                            {roomCode}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyRoomCode}
                            className="h-8 w-8"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Player status */}
                {players < 2 ? (
                    <div className="mb-8 p-6 bg-gray-800/50 rounded-lg flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-4">
                            <RefreshCw className="h-5 w-5 animate-spin text-blue-400" />
                            <p className="text-lg">Waiting for opponent to join...</p>
                        </div>
                        <p className="text-sm text-gray-400">Share the room code with a friend</p>
                    </div>
                ) : (
                    <div className="mb-8">
                        <div className={cn(
                            "text-xl font-medium mb-2",
                            currentTurn === "X" ? "text-blue-400" : "text-pink-400"
                        )}>
                            {winner
                                ? winner.winner === "DRAW"
                                    ? "Game ended in a draw!"
                                    : `Player ${winner && winner.name === name ? "You" : winner.name} wins!`
                                    : `${currentTurn === playerSymbol ? "Your" : currentTurn}'s turn`
                            }
                        </div>

                        {/* Game board */}
                        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
                                {board.map((row, rowIndex) =>
                                    row.map((_, colIndex) => renderCell(rowIndex, colIndex))
                                )}
                        </div>

                        {/* Game controls */}
                        <div className="flex justify-center gap-4">
                            {winner && (
                                <Button onClick={game?.resetGame} className="bg-green-600 hover:bg-green-700">
                                    Play Again
                                </Button>
                            )}
                            <Button
                                onClick={() => navigate.push("/")}
                                variant="outline"
                                    className="border-white flex items-center gap-2 text-gray-700"
                            >
                                <ArrowLeft className="h-4 w-4 text-gray-700" />
                                Back to Rooms
                            </Button>
                        </div>  
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
