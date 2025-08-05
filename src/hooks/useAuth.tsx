import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiService from '../services/apiService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On app start, check for an existing session token.
    const verifySession = () => {
      try {
        const tokenExists = apiService.checkAuthStatus();
        setIsAuthenticated(tokenExists);
      } catch (error) {
        console.error("Could not verify session:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const success = await apiService.loginUser(email, pass);
      if (success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
  };

  const logout = useCallback(() => {
    apiService.logoutUser();
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate]);

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
