import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  riskScore: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => void;
}

const API_URL = 'http://localhost:5001/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(true);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        message: data.securityMessage,
      };
    } catch (error) {
      console.error('Login error:', error);

      return {
        success: false,
        message: 'Server connection error',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem('token');

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!response.ok) {
          logout();
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        setUser(data.user);
        setToken(savedToken);
      } catch (error) {
        console.error('Fetch current user error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};