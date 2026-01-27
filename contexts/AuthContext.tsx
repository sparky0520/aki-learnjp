"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const apiUrl = "/api";

interface AuthContextType {
  currentUser;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      // Wait for Clerk to load
      if (!isLoaded) {
        return;
      }

      // If not signed in, clear state
      if (!isSignedIn || !user) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) {
          throw new Error("User email not found");
        }

        // Try to sign up/sync user with backend
        const signupResponse = await fetch(`${apiUrl}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerk_user_id: user.id,
            email: email,
            name: user.fullName || user.firstName || "User",
            profile_image_url: user.imageUrl || null,
          }),
        });

        if (!signupResponse.ok) {
          throw new Error("Failed to sync user with backend");
        }

        const signupData = await signupResponse.json();
        setCurrentUser(signupData.user);
      } catch (err) {
        console.error("Error syncing user:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
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
