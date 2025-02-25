import React, { createContext, useState, useContext } from 'react';

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

export const AuthProvider: React.FC = ({ children }) => {
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

// Replace with actual API call
const mockLoginAPI = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === 'admin@example.com' && password === 'admin123') {
    return {
      user: {
        id: '1',
        name: 'Admin User',
        role: 'admin',
        email: 'admin@example.com',
      },
    };
  }
  
  if (email === 'doctor@example.com' && password === 'doctor123') {
    return {
      user: {
        id: '2',
        name: 'Doctor User',
        role: 'doctor',
        email: 'doctor@example.com',
      },
    };
  }

  if (email === 'patient@example.com' && password === 'patient123') {
    return {
      user: {
        id: '3',
        name: 'Patient User',
        role: 'patient',
        email: 'patient@example.com',
      },
    };
  }

  throw new Error('Invalid credentials');
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