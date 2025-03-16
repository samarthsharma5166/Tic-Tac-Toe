import { symbolName } from "typescript";
import { WebSocketServer, WebSocket as Ws } from "ws";
interface players {
  name: string;
  playerSymbol: "X" | "O";
  ws: Ws;
}
interface Room {
  players: players[];
  board: string[][];
  turn: "X" | "O";
  roomName: string;
}

class Game {
  private wss: WebSocketServer;
  private rooms: Room[] = [];
  constructor() {
    this.wss = new WebSocketServer({
      port: 8080,
    });
    this.initServer();
  }

  checkWinner(board: string[][]): string | null {
    const winPatterns = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ], // Row 1
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ], // Row 2
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ], // Row 3
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ], // Column 1
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ], // Column 2
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ], // Column 3
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ], // Diagonal
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ], // Diagonal
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        board[a[0]][a[1]] &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return board[a[0]][a[1]]; // "X" or "O"
      }
    }

    return board.flat().includes("") ? null : "DRAW";
  }

  initServer() {
    this.wss.on("connection", (ws) => {
      console.log("new connection");
      ws.on("message", (message: string) => {
        const parsedMess = JSON.parse(message);
        console.log(parsedMess);
        if (parsedMess.type === "reset") {
          this.rooms[parsedMess.roomId].board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ];
          this.rooms[parsedMess.roomId].turn = "X";
          this.rooms[parsedMess.roomId].players.map((player) => {
            player.ws.send(
              JSON.stringify({
                type: "playagain",
                board: this.rooms[parsedMess.roomId].board,
                turn: this.rooms[parsedMess.roomId].turn,
              })
            );
          });
        }
        if (parsedMess.type === "join") {
          if (!this.rooms[parsedMess.roomId]) {
            this.rooms[parsedMess.roomId] = {
              players: [],
              board: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ],
              roomName: parsedMess.roomName,
              turn: "X",
            };
            // this.rooms[parsedMess.roomId].players.push(parsedMess.name);
          }
          const room = this.rooms[parsedMess.roomId];
          if (room.players.length >= 2) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Room is full",
              })
            );
            return;
          }
          if (room.players.length < 2) {
            room.players.push({
              name: parsedMess.name,
              playerSymbol: room.players.length === 0 ? "X" : "O",
              ws,
            });
          }
          room.players.map((player) => {
            player.ws.send(
              JSON.stringify({
                type: "joined",
                name: player.name,
                playerSymbol: player.playerSymbol,
                players: room.players.length,
              })
            );
          });
        }
        if (parsedMess.type === "move") {
          console.log('inside move',parsedMess.roomId)
          const game = this.rooms[parsedMess.roomId];
          console.log("dfkdsa",game)
          const { row, col } = parsedMess;
          if (game && game.board[row][col] === "") {
            const playerSymbol = game.turn;
            if (
              row < 0 ||
              row >= 3 ||
              col < 0 ||
              col >= 3 ||
              game.board[row][col] !== ""
            ) {
              game.players.forEach((player) => {
                player.ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Invalid move",
                  })
                );
              });
              return;
            }
            console.log('playersymboal',playerSymbol)
            if (parsedMess.playerSymbol !== playerSymbol) {
              game.players.forEach((player) => {
                if (parsedMess.name === player.name) {
                  player.ws.send(
                    JSON.stringify({
                      type: "error",
                      message: "It's not your turn",
                    })
                  );
                }
                return;
              });
            }
            console.log('updating the board')
            game.board[row][col] = playerSymbol;
            console.log(JSON.stringify(game.board));
            game.turn = playerSymbol === "X" ? "O" : "X";
            const winner = this.checkWinner(game.board);
            game.players.forEach((player) => {
              player.ws.send(
                JSON.stringify({
                  type: "updatedBoard",
                  board: game.board,
                  turn: game.turn,
                })
              );
            });
            if (winner) {
              const winnerPlayer = game.players.find(
                (player) => player.playerSymbol === winner
              );
              const name = winnerPlayer ? winnerPlayer.name : "Draw";

              console.log(name);
              game.players.forEach((player) => {
                player.ws.send(
                  JSON.stringify({ type: "gameOver", winner, name: name })
                );
              });
              return;
            }
          }
        }
      });
      ws.on("close", () => {
        this.rooms.forEach((room, roomId) => {
          room.players = room.players.filter((player) => player.ws !== ws);
          if (room.players.length === 0) {
            delete this.rooms[roomId];
          } else {
            room.players.forEach((player) => {
              player.ws.send(
                JSON.stringify({
                  type: "playerLeft",
                  message: "Your opponent left the game.",
                })
              );
            });
          }
        });

        console.log(`User disconnected`);
      });
    });
  }
}

const g = new Game();
