import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within UserProvider');
  return ctx;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          setUserState(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do AsyncStorage:', error);
      }
    };
    
    loadStoredUser();
  }, []);

  function setUser(newUser: User | null) {
    setUserState(newUser);
    if (newUser) {
      AsyncStorage.setItem('user', JSON.stringify(newUser));
    } else {
      AsyncStorage.removeItem('user');
    }
  }

  function logout() {
    setUser(null);
    AsyncStorage.removeItem('access_token');
    AsyncStorage.removeItem('refresh_token');
  }

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}

