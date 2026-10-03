import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '../../features/auth/api';

import {
  getToken,
  removeToken,
  setToken,
} from '../../features/auth/storage';

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '../../features/auth/types';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        removeToken();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(payload: LoginPayload) {
    const response = await loginRequest(payload);

    const token =
      response.access_token ??
      response.accessToken ??
      response.token;

    if (!token) {
      throw new Error(
        'Login succeeded but no authentication token was returned.',
      );
    }

    setToken(token);

    const currentUser = await getCurrentUser();

    setUser(currentUser);
  }

  async function register(payload: RegisterPayload) {
    const response = await registerRequest(payload);

    const token =
      response.access_token ??
      response.accessToken ??
      response.token;

    if (!token) {
      throw new Error(
        'Registration succeeded but no authentication token was returned.',
      );
    }

    setToken(token);

    const currentUser = await getCurrentUser();

    setUser(currentUser);
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}