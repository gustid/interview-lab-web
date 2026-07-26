import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, login as loginRequest } from './api/auth-api';
import { AuthContext } from './auth-context';
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from './auth-storage';
import type { LoginInput, User } from './auth.types';

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        removeAccessToken();

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (input: LoginInput): Promise<void> => {
      const response = await loginRequest(input);

      queryClient.clear();
      setAccessToken(response.accessToken);
      setUser(response.user);
    },
    [queryClient],
  );

  const logout = useCallback((): void => {
    removeAccessToken();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
