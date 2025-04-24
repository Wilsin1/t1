
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, User } from './AuthContext';
import { toast } from '@/components/ui/sonner';

export type GameRoom = {
  id: string;
  name: string;
  createdBy: string;
  creatorUsername: string;
  player1: string | null;
  player1Username: string | null;
  player2: string | null;
  player2Username: string | null;
  status: 'waiting' | 'in_progress' | 'completed';
  winner: string | null;
  board: (string | null)[];
  currentTurn: string | null;
  betAmount: number;
  createdAt: number;
};

type GameContextType = {
  rooms: GameRoom[];
  currentRoom: GameRoom | null;
  createRoom: (name: string, betAmount: number) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  makeMove: (index: number) => void;
  refreshRooms: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateCredits } = useAuth();
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);

  // Load game rooms from localStorage
  useEffect(() => {
    refreshRooms();
  }, []);

  // Refresh rooms list
  const refreshRooms = () => {
    const storedRooms = JSON.parse(localStorage.getItem('tictactoe-rooms') || '[]');
    
    // Sort rooms: waiting first, then in_progress, then completed
    const sortedRooms = [...storedRooms].sort((a, b) => {
      const statusPriority: Record<string, number> = {
        waiting: 0,
        in_progress: 1,
        completed: 2
      };
      return statusPriority[a.status] - statusPriority[b.status] || b.createdAt - a.createdAt;
    });
    
    setRooms(sortedRooms);
    
    // If user is in a room, update current room state
    if (user && currentRoom) {
      const updatedRoom = sortedRooms.find(room => room.id === currentRoom.id);
      if (updatedRoom) {
        setCurrentRoom(updatedRoom);
      }
    }
  };

  const createRoom = (name: string, betAmount: number) => {
    if (!user) {
      toast.error('You must be logged in to create a room');
      return;
    }

    if (user.credits < betAmount) {
      toast.error('Not enough credits to place this bet');
      return;
    }

    const newRoom: GameRoom = {
      id: `room_${Date.now()}`,
      name,
      createdBy: user.id,
      creatorUsername: user.username,
      player1: user.id,
      player1Username: user.username,
      player2: null,
      player2Username: null,
      status: 'waiting',
      winner: null,
      board: Array(9).fill(null),
      currentTurn: user.id,
      betAmount,
      createdAt: Date.now()
    };

    const updatedRooms = [newRoom, ...rooms];
    localStorage.setItem('tictactoe-rooms', JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    setCurrentRoom(newRoom);
    
    // Subtract bet amount from creator's credits
    updateCredits(-betAmount);
    
    toast.success('Game room created successfully');
  };

  const joinRoom = (roomId: string) => {
    if (!user) {
      toast.error('You must be logged in to join a room');
      return;
    }

    const roomToJoin = rooms.find(room => room.id === roomId);
    if (!roomToJoin) {
      toast.error('Room not found');
      return;
    }

    if (roomToJoin.status !== 'waiting') {
      toast.error('This room is not available for joining');
      return;
    }

    if (user.credits < roomToJoin.betAmount) {
      toast.error('Not enough credits to match this bet');
      return;
    }

    const updatedRoom: GameRoom = {
      ...roomToJoin,
      player2: user.id,
      player2Username: user.username,
      status: 'in_progress'
    };

    const updatedRooms = rooms.map(room => 
      room.id === roomId ? updatedRoom : room
    );

    localStorage.setItem('tictactoe-rooms', JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    setCurrentRoom(updatedRoom);
    
    // Subtract bet amount from second player's credits
    updateCredits(-roomToJoin.betAmount);
    
    toast.success('Joined game room');
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    toast.info('Left game room');
  };

  const checkWinner = (board: (string | null)[]): string | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    // Check for draw (all cells filled)
    if (board.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const makeMove = (index: number) => {
    if (!user || !currentRoom) {
      toast.error('Invalid game state');
      return;
    }

    if (currentRoom.status !== 'in_progress') {
      toast.error('This game is not active');
      return;
    }

    if (currentRoom.currentTurn !== user.id) {
      toast.error('It\'s not your turn');
      return;
    }

    if (currentRoom.board[index] !== null) {
      toast.error('This cell is already taken');
      return;
    }

    const newBoard = [...currentRoom.board];
    const playerMark = currentRoom.player1 === user.id ? 'X' : 'O';
    newBoard[index] = playerMark;

    const nextTurn = currentRoom.currentTurn === currentRoom.player1 
      ? currentRoom.player2
      : currentRoom.player1;

    let updatedStatus = currentRoom.status;
    let winner = null;
    const gameResult = checkWinner(newBoard);

    if (gameResult) {
      updatedStatus = 'completed';
      if (gameResult === 'draw') {
        // It's a draw, refund both players
        if (currentRoom.player1) updateCredits(currentRoom.betAmount);
        if (currentRoom.player2) updateCredits(currentRoom.betAmount);
        toast.info('Game ended in a draw! Your bet has been refunded.');
      } else {
        winner = user.id;
        // Winner gets double their bet
        updateCredits(currentRoom.betAmount * 2);
        toast.success('You won! Credits have been added to your account.');
      }
    }

    const updatedRoom: GameRoom = {
      ...currentRoom,
      board: newBoard,
      currentTurn: nextTurn,
      status: updatedStatus,
      winner
    };

    const updatedRooms = rooms.map(room => 
      room.id === currentRoom.id ? updatedRoom : room
    );

    localStorage.setItem('tictactoe-rooms', JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    setCurrentRoom(updatedRoom);
  };

  const value = {
    rooms,
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    makeMove,
    refreshRooms
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
