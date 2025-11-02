import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextData {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (userData: User, authToken: string, authRefreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      setIsLoading(true);
      
      const [storedUser, storedToken, storedRefreshToken] = await Promise.all([
        AsyncStorage.getItem('@Finly:user'),
        AsyncStorage.getItem('@Finly:token'),
        AsyncStorage.getItem('@Finly:refreshToken'),
      ]);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData: User, authToken: string, authRefreshToken: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('@Finly:user', JSON.stringify(userData)),
        AsyncStorage.setItem('@Finly:token', authToken),
        AsyncStorage.setItem('@Finly:refreshToken', authRefreshToken),
      ]);

      setUser(userData);
      setToken(authToken);
      setRefreshToken(authRefreshToken);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('@Finly:user'),
        AsyncStorage.removeItem('@Finly:token'),
        AsyncStorage.removeItem('@Finly:refreshToken'),
      ]);

      setUser(null);
      setToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...userData };
      
      await AsyncStorage.setItem('@Finly:user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        isAuthenticated,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextData {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }

  return context;
}
