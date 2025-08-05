import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as mockApi from '../services/mockApi';

const SESSION_TOKEN_KEY = 'champ_session_token';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading until session is verified
  const navigate = useNavigate();

  useEffect(() => {
    // On app start, check for an existing session token.
    const verifySession = async () => {
      try {
        const token = window.sessionStorage.getItem(SESSION_TOKEN_KEY);
        if (token) {
          // In a real app, you'd send this token to a backend to verify.
          // For our mock, we just check if it exists.
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Could not access session storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (user: string, pass: string): Promise<boolean> => {
    const token = await mockApi.loginUser(user, pass);
    if (token) {
      try {
        window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error("Could not access session storage:", error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    try {
      window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
    } catch (error) {
       console.error("Could not access session storage:", error);
    }
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = { isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};