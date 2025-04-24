
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

export type User = {
  id: string;
  username: string;
  email: string;
  credits: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCredits: (amount: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem('tictactoe-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('tictactoe-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - would connect to backend in real application
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock user lookup
      const storedUsers = JSON.parse(localStorage.getItem('tictactoe-users') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      if (foundUser.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Create user session without password
      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        credits: foundUser.credits || 100 // Default credits
      };
      
      localStorage.setItem('tictactoe-user', JSON.stringify(userSession));
      setUser(userSession);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock registration function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock registration delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('tictactoe-users') || '[]');
      const userExists = storedUsers.some((u: any) => u.email === email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        password,
        credits: 100 // Initial credits
      };
      
      // Save to "database"
      storedUsers.push(newUser);
      localStorage.setItem('tictactoe-users', JSON.stringify(storedUsers));
      
      // Create user session without password
      const userSession = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        credits: newUser.credits
      };
      
      localStorage.setItem('tictactoe-user', JSON.stringify(userSession));
      setUser(userSession);
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('tictactoe-user');
    setUser(null);
    toast.info('You have been logged out');
  };

  const updateCredits = (amount: number) => {
    if (!user) return;
    
    const newCredits = user.credits + amount;
    const updatedUser = { ...user, credits: newCredits };
    
    // Update current user state
    setUser(updatedUser);
    
    // Update local storage for persistence
    localStorage.setItem('tictactoe-user', JSON.stringify(updatedUser));
    
    // Update in "database" as well
    const storedUsers = JSON.parse(localStorage.getItem('tictactoe-users') || '[]');
    const updatedUsers = storedUsers.map((u: any) => 
      u.id === user.id ? { ...u, credits: newCredits } : u
    );
    localStorage.setItem('tictactoe-users', JSON.stringify(updatedUsers));
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateCredits
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
