import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  setAuth: (user: User | null, session?: Session | null) => void;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const setAuth = (authUser: User | null, authSession: Session | null = null) => {
    setUser(authUser);
    setSession(authSession);
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Subscribe to Supabase auth changes
  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);


  return (
    <AuthContext.Provider value={{ user, session, setAuth, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
