
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="container py-16 md:py-24 flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold game-font text-primary mb-6">
            Tic-Tac-Toe Arena
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Play tic-tac-toe online against other players and bet credits to win big!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <>
                <Button size="lg" onClick={() => navigate('/lobby')} className="px-8">
                  Enter Game Lobby
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/credits')} className="px-8">
                  Buy Credits
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate('/register')} className="px-8">
                  Sign Up
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="px-8">
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-card py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 game-font text-primary">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary/20 p-6 rounded-lg animate-fade-in">
                <h3 className="text-xl font-semibold mb-3 text-primary">1. Create an Account</h3>
                <p className="text-muted-foreground">
                  Sign up and get 100 free credits to start playing and betting right away.
                </p>
              </div>
              
              <div className="bg-secondary/20 p-6 rounded-lg animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h3 className="text-xl font-semibold mb-3 text-primary">2. Join or Create Games</h3>
                <p className="text-muted-foreground">
                  Find a game in the lobby or create your own room with custom bet amounts.
                </p>
              </div>
              
              <div className="bg-secondary/20 p-6 rounded-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
                <h3 className="text-xl font-semibold mb-3 text-primary">3. Win and Earn Credits</h3>
                <p className="text-muted-foreground">
                  Beat your opponent to win double your bet and build your credit balance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-background border-t border-border py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Tic-Tac-Toe Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
