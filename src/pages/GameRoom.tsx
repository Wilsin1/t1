
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TicTacToeBoard from "@/components/TicTacToeBoard";
import Header from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";

const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { rooms, currentRoom, joinRoom, leaveRoom, refreshRooms } = useGame();
  const navigate = useNavigate();
  
  // Find room by ID when first loading the page
  useEffect(() => {
    if (roomId && !currentRoom) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        joinRoom(roomId);
      } else {
        navigate('/lobby');
      }
    }
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      refreshRooms();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [roomId, rooms, currentRoom, joinRoom, navigate, refreshRooms]);
  
  const handleBackToLobby = () => {
    leaveRoom();
    navigate('/lobby');
  };

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading game...</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8 flex justify-center">
          <Card className="w-full max-w-2xl border-border bg-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl game-font text-primary">
                {currentRoom.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <TicTacToeBoard />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleBackToLobby}
                className="w-full sm:w-auto"
              >
                Back to Lobby
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
};

export default GameRoom;
