import React, {createContext, useState, useContext} from 'react';
import {AuthAPI} from '../src/services/api';

type UserRole = 'patient' | 'doctor' | 'admin';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      // Replace with actual API call
      const response = await mockLoginAPI(email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // Replace with actual API call
      const response = await mockRegisterAPI(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockLoginAPI = async (email: string, password: string) => {
  try {
    const response = await AuthAPI.login({email, password});
    console.log('response = ', response);
    return {
      user: response,
    };
  } catch (error) {
    throw error;
  }
};

const mockRegisterAPI = async (userData: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    user: {
      id: '4',
      ...userData,
    },
  };
};
