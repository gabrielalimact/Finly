import { useUser } from './UserContext';

export function useAuth() {
  const { isAuthenticated, isLoading, user, token } = useUser();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    token,
    isReady: !isLoading,
  };
}

export function useAuthActions() {
  const { signIn, signOut, updateUser } = useUser();
  
  return {
    login: signIn,
    logout: signOut,
    updateProfile: updateUser,
  };
}

export function useUserData() {
  const { user, updateUser } = useUser();
  
  return {
    user,
    updateUser,
    userName: user?.name || '',
    userEmail: user?.email || '',
  };
}
