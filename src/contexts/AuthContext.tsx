import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, tokenStorage } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'VENDOR' | 'COMPANY' | 'ADMIN';
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "hourglass_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem(USER_KEY);
    const token = tokenStorage.get();
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify token is still valid by fetching current user
        api.getCurrentUser()
          .then((currentUser) => {
            setUser({
              id: currentUser.id,
              email: currentUser.email,
              name: currentUser.name,
              role: currentUser.role as 'VENDOR' | 'COMPANY' | 'ADMIN',
              active: true, // Default to active if not provided
            });
          })
          .catch(() => {
            // Token invalid, clear storage
            tokenStorage.remove();
            localStorage.removeItem(USER_KEY);
            setUser(null);
          })
          .finally(() => setIsLoading(false));
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      
      const userData: User = {
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role as 'VENDOR' | 'COMPANY' | 'ADMIN',
        active: true,
      };
      
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid email or password" 
      };
    }
  };

  const logout = () => {
    setUser(null);
    tokenStorage.remove();
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
