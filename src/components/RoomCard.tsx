
import { useNavigate } from "react-router-dom";
import { useGame, GameRoom } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: GameRoom;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const { joinRoom } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isCreator = user?.id === room.createdBy;
  const isPlayerInRoom = user?.id === room.player1 || user?.id === room.player2;
  
  const handleJoin = () => {
    joinRoom(room.id);
    navigate(`/game/${room.id}`);
  };
  
  const handleContinue = () => {
    navigate(`/game/${room.id}`);
  };

  // Format the creation time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className={cn(
      "game-card overflow-hidden",
      isPlayerInRoom && room.status === 'in_progress' && "border-primary"
    )}>
      <CardHeader className="p-4 bg-secondary/20 flex flex-row justify-between items-center">
        <CardTitle className="text-lg">{room.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant={room.status === 'waiting' ? "outline" : 
                   room.status === 'in_progress' ? "default" : 
                   "secondary"}
            className={cn(
              room.status === 'waiting' && "border-yellow-500 text-yellow-500",
              room.status === 'in_progress' && "bg-green-600",
              room.status === 'completed' && "bg-muted"
            )}
          >
            {room.status === 'waiting' ? 'Waiting' : 
             room.status === 'in_progress' ? 'In Progress' : 
             'Completed'}
          </Badge>
          <Badge variant="outline" className="border-primary text-primary">
            {room.betAmount} Credits
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Created by:</span>{' '}
            <span className="font-medium">{room.creatorUsername}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTime(room.createdAt)}
          </div>
        </div>
        
        <div className="mt-3 flex justify-between border-t border-border pt-3">
          <div className="text-sm">
            <div className="flex gap-1">
              <span className="text-muted-foreground">Player 1:</span>{' '}
              <span className="font-medium">{room.player1Username || "Waiting..."}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-muted-foreground">Player 2:</span>{' '}
              <span className="font-medium">{room.player2Username || "Waiting..."}</span>
            </div>
          </div>
          
          {room.status === 'completed' && (
            <div className="text-right">
              <div className="text-sm font-medium">
                {room.winner === 'draw' ? (
                  <span className="text-yellow-400">Draw</span>
                ) : room.winner === user?.id ? (
                  <span className="text-green-500">You Won</span>
                ) : isPlayerInRoom ? (
                  <span className="text-red-500">You Lost</span>
                ) : (
                  <span>Game Ended</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        {isPlayerInRoom ? (
          <Button 
            onClick={handleContinue}
            disabled={room.status === 'completed'}
            className="w-full sm:w-auto"
          >
            {room.status === 'waiting' ? "View Game" : 
             room.status === 'in_progress' ? "Continue Game" : 
             "View Results"}
          </Button>
        ) : (
          <Button
            onClick={handleJoin}
            disabled={
              room.status !== 'waiting' || 
              (user?.credits || 0) < room.betAmount
            }
            className="w-full sm:w-auto"
          >
            Join Game
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
