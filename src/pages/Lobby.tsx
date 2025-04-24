
import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/RoomCard";
import CreateRoomModal from "@/components/CreateRoomModal";
import Header from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";

const Lobby = () => {
  const { rooms, refreshRooms } = useGame();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'waiting' | 'in_progress' | 'completed'>('all');

  // Refresh rooms on component load and every 5 seconds
  useEffect(() => {
    refreshRooms();
    const interval = setInterval(() => {
      refreshRooms();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refreshRooms]);

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold game-font text-primary mb-4 sm:mb-0">
              Game Lobby
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button 
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="rounded-none"
                >
                  All
                </Button>
                <Button 
                  variant={filter === 'waiting' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('waiting')}
                  className="rounded-none"
                >
                  Waiting
                </Button>
                <Button 
                  variant={filter === 'in_progress' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('in_progress')}
                  className="rounded-none"
                >
                  Active
                </Button>
                <Button 
                  variant={filter === 'completed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('completed')}
                  className="rounded-none"
                >
                  Completed
                </Button>
              </div>
              
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Room
              </Button>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                {filter === 'all' 
                  ? "No game rooms available" 
                  : `No ${filter} games available`}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create New Room
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </main>

        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
};

export default Lobby;
