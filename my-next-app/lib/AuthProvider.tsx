"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  deleteAccount as deleteAccountRequest,
  getErrorMessage,
  initAuth,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type User,
} from "@/services/authService";

type Credentials = {
  username: string;
  password: string;
  email?: string;
};

type AuthResult = {
  success: boolean;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: Credentials) => Promise<AuthResult>;
  register: (data: Required<Credentials>) => Promise<AuthResult>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    initAuth().then((session) => {
      if (!mounted) return;
      setUser(session.user);
      setIsAuthenticated(session.isAuthenticated);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      async login(data) {
        const result = await loginRequest(data);
        if (!result.ok) {
          return { success: false, error: getErrorMessage(result.error, "Login failed") };
        }

        if (!result.user) return { success: false, error: "Login failed" };
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      },
      async register(data) {
        const result = await registerRequest(data);
        if (!result.ok) {
          return { success: false, error: getErrorMessage(result.error, "Sign up failed") };
        }

        if (!result.user) return { success: false, error: "Sign up failed" };
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      },
      async logout() {
        await logoutRequest();
        setUser(null);
        setIsAuthenticated(false);
      },
      async deleteAccount() {
        await deleteAccountRequest();
        setUser(null);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
