import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter, useSegments } from 'expo-router';
import pb from '../service/pocketbase';
import { RecordModel } from 'pocketbase';

// Define the shape of the context
interface AuthContextType {
  user: RecordModel | null;
  signOut: () => void;
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the session context
export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Provider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Verify and set the current user
        if (pb.authStore.isValid) {
          setUser(pb.authStore.model);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, router]);

  const signOut = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
