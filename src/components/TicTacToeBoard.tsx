
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const TicTacToeBoard = () => {
  const { currentRoom, makeMove } = useGame();
  const { user } = useAuth();
  
  if (!currentRoom || !user) return null;
  
  const isMyTurn = currentRoom.currentTurn === user.id;
  const isPlayer1 = currentRoom.player1 === user.id;
  const myMark = isPlayer1 ? 'X' : 'O';
  const opponentMark = isPlayer1 ? 'O' : 'X';
  const opponent = isPlayer1 ? currentRoom.player2Username : currentRoom.player1Username;

  // Check for winning patterns to highlight winning cells
  const getWinningCells = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    if (currentRoom.status !== 'completed' || currentRoom.winner === 'draw') {
      return [];
    }

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentRoom.board[a] && 
        currentRoom.board[a] === currentRoom.board[b] && 
        currentRoom.board[a] === currentRoom.board[c]
      ) {
        return pattern;
      }
    }

    return [];
  };
  
  const winningCells = getWinningCells();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Game status */}
      <div className="text-center mb-6">
        {currentRoom.status === 'waiting' ? (
          <div className="text-muted-foreground">Waiting for opponent to join...</div>
        ) : currentRoom.status === 'completed' ? (
          currentRoom.winner === 'draw' ? (
            <div className="text-xl font-semibold text-yellow-400">Game ended in a draw!</div>
          ) : (
            <div className="text-xl font-semibold">
              {currentRoom.winner === user.id ? (
                <span className="text-green-500">You won! 🎉</span>
              ) : (
                <span className="text-red-500">You lost! 😢</span>
              )}
            </div>
          )
        ) : (
          <div className={cn(
            "text-xl font-medium",
            isMyTurn ? "text-green-500" : "text-muted-foreground"
          )}>
            {isMyTurn ? "Your turn" : `${opponent}'s turn`}
          </div>
        )}
      </div>
      
      {/* Bet amount */}
      <div className="text-center mb-4">
        <div className="inline-block px-4 py-1 bg-secondary/50 rounded-full">
          <span className="text-sm opacity-70">Bet Amount: </span>
          <span className="text-primary font-bold">{currentRoom.betAmount} Credits</span>
        </div>
      </div>

      {/* Game board */}
      <div className="grid grid-cols-3 gap-3 w-full aspect-square mb-4">
        {currentRoom.board.map((cell, index) => (
          <button 
            key={index}
            className={cn(
              "tic-tac-toe-cell",
              winningCells.includes(index) && "winner-cell"
            )}
            onClick={() => isMyTurn && currentRoom.status === 'in_progress' ? makeMove(index) : null}
            disabled={
              !isMyTurn || 
              currentRoom.status !== 'in_progress' || 
              cell !== null
            }
          >
            {cell === 'X' && <span className="x-mark">X</span>}
            {cell === 'O' && <span className="o-mark">O</span>}
          </button>
        ))}
      </div>
      
      {/* Player info */}
      <div className="flex justify-between items-center mt-6 px-2">
        <div className="text-center">
          <div className={cn(
            "font-bold",
            isPlayer1 ? "text-red-500" : "text-blue-400"
          )}>
            You ({myMark})
          </div>
          <div className="text-xs opacity-70">{user.username}</div>
        </div>
        
        <div className="w-px h-8 bg-border"></div>
        
        <div className="text-center">
          <div className={cn(
            "font-bold",
            !isPlayer1 ? "text-red-500" : "text-blue-400"
          )}>
            Opponent ({opponentMark})
          </div>
          <div className="text-xs opacity-70">{opponent || "Waiting..."}</div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeBoard;
