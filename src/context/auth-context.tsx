"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthChange, signOutUser as firebaseSignOut } from '@/lib/auth';
import type { User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    // onAuthChange returns an unsubscribe function
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await firebaseSignOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: error.message || "Could not sign out. Please try again.",
      });
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
