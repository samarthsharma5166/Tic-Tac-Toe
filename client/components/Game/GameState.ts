import { toast } from "sonner";

type Player = "X" | "O";
type BoardState = (Player | "")[][];
interface winner {
  winner: "X" | "O" | "DRAW";
  name: string;
}
export class GameState {
  board: BoardState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentTurn: Player = "X";
  winner: winner | null = null;
  playerSybmbol: Player | null = null;
  players: number = 0;
  setPlayers?: (players: number) => void;
  setBoard?: (board: BoardState) => void;
  setCurrentTurn?: (turn: Player) => void;
  setWinner?: (winner: winner | null) => void;
  setPlayerSymbol?: (symbol: Player) => void;
  private player: string | null = null;
  private socket: WebSocket;
  private roomId:string;

  constructor(socket: WebSocket,roomCode:string) {
    this.socket = socket;
    console.log("WebSocket connected:", socket.readyState === WebSocket.OPEN);
    this.roomId=roomCode;
    this.initMessage();
    this.resetGame = this.resetGame.bind(this);

  }

  setPlayersCallback(callback: (players: number) => void) {
    console.log("Setting players callback");
    this.setPlayers = callback;
  }

  setBoardCallback(callback: (board: BoardState) => void) {
    console.log("Setting board callback");
    this.setBoard = callback;
  }

  setcurrentTurnCallback(callback: (turn: Player) => void) {
    console.log("Setting currentTurn callback");
    this.setCurrentTurn = callback;
  }

  setWinnerCallback(callback: (winner: winner | null) => void) {
    console.log("Setting winner callback");
    this.setWinner = callback;
  }

  setPlayerSymbolCallback(callback: (symbol: Player) => void) {
    console.log("Setting playerSymbol callback");
    this.setPlayerSymbol = callback;
  }

  initMessage() {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Received WebSocket message:", data);

      if (data.type === "joined") {
        console.log("Player joined:", data);
        this.player = data.name;
        this.playerSybmbol = data.playerSymbol;
        this.players = Number(data.players);
        this.setPlayers?.(this.players);
        this.setPlayerSymbol?.(this.playerSybmbol!);
      }

      if (data.type === "updatedBoard") {
        console.log("Board updated:", data);
         this.board = data.board.map((row: (Player | "")[]) => [...row]); 
        this.currentTurn = data.turn;
        this.setBoard?.(this.board);
        this.setCurrentTurn?.(this.currentTurn);
      }

      if (data.type === "playagain") {
        console.log("Play again:", data);
        this.board = data.board;
        this.currentTurn = data.turn;
        this.winner = null;
        this.setBoard?.(this.board);
        this.setCurrentTurn?.(this.currentTurn);
        this.setWinner?.(null);
      }

      if (data.type === "gameOver") {
        console.log("Game over:", data);
        this.winner = {
          name: data.name,
          winner: data.winner,
        };
        this.setWinner?.(this.winner);

        if (data.winner === this.playerSybmbol) {
          toast(`
            title: You won!,
            description: Congratulations! You won the game.,
          `);
        } else {
          toast(`
            title: You lost!,
            description: Better luck next time.,
          `);
        }
      }
    };
  }

  handleCellClick(row: number, col: number) {
    console.log("Cell clicked:", row, col);
    console.log("Current turn:", this.currentTurn);
    console.log("Player symbol:", this.playerSybmbol);
    console.log("Winner:", this.winner);
    console.log("Board state:", this.board);

    if (this.winner || this.board[row][col] || this.players < 2) {
      console.log(
        "Cannot make a move. Game over, cell occupied, or not enough players."
      );
      return;
    }

    if (this.currentTurn !== this.playerSybmbol) {
      console.log("Not your turn. Current turn:", this.currentTurn);
      toast(`
        title: Not your turn,
        description: Please wait for your turn...,
      `);
      return;
    }

    console.log("Sending move to server...");
    this.socket.send(
      JSON.stringify({
        type: "move",
        row: row,
        col: col,
        playerSymbol: this.playerSybmbol,
        roomId: this.roomId,
      })
    );
  }

  resetGame() {
    this.socket.send(
      JSON.stringify({
        type: "reset",
        roomId: this.roomId,
      })
    );
    this.winner = null;
    this.setWinner?.(null);
  }
}