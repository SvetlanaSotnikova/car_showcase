"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdmin } from "@/utils";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.emailVerified || isAdmin(user.email)) return;

    const createdAt = user.metadata.creationTime;
    const hourOld =
      Date.now() - new Date(createdAt!).getTime() > 60 * 60 * 1000;

    if (hourOld) {
      signOut(auth).then(() => {
        window.location.replace("/auth?reason=unverified");
      });
    }
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("logout error: ", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
