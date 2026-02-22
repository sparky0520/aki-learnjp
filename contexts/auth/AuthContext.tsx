"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const apiUrl = "/api";

interface AuthContextType {
  currentUser;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSynced: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isSynced: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    // Set current user from Clerk data
    setCurrentUser({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName || user.firstName || user.username || "User",
      profile_image_url: user.imageUrl,
      publicMetadata: user.publicMetadata,
    });
    setIsLoading(false);
  }, [isSignedIn, isLoaded, user]);

  const value = {
    currentUser,
    isLoading,
    error,
    isAuthenticated: (isSignedIn ?? false) && !!currentUser,
    isSynced: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
