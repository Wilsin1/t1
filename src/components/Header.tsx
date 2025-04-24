
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-card py-4 border-b border-border">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary game-font">
            Tic-Tac-Toe Arena
          </h1>
        </Link>

        <nav className="flex-1 flex justify-center items-center px-4">
          {user && (
            <div className="hidden sm:flex gap-4">
              <Link to="/lobby" className="text-foreground hover:text-primary transition-colors">
                Game Lobby
              </Link>
              <Link to="/credits" className="text-foreground hover:text-primary transition-colors">
                Buy Credits
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="text-sm mr-4">
                <span className="opacity-70">Welcome, </span>
                <span className="font-bold">{user.username}</span>
                <div className="text-xs text-primary font-bold">{user.credits} Credits</div>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm">
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/login')} size="sm">
                Login
              </Button>
              <Button variant="default" onClick={() => navigate('/register')} size="sm">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
