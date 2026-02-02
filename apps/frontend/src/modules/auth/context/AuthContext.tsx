import {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";

import type { IUser, AuthContextType } from "../type";

import { profile } from "../api/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const refetchUser = useCallback(async () => {
    try {
      const res = await profile();
      if (res.success) {
        setUser(res.data);
      }
    } catch (error) {
      setUser(null);
      console.error("Failed to refresh profile", error);
    }
  }, []);
  // useEffect(() => {
  //   const authCheck = async () => {
  //     try {
  //       const res = await getProfile();
  //       if (res.success) {
  //         setUser(res.data);
  //       }
  //     } catch (error) {
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   authCheck();
  // }, []);
  useEffect(() => {
    const initAuth = async () => {
      await refetchUser();
      setLoading(false);
    };
    initAuth();
  }, [refetchUser]);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, setUser, refetchUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
