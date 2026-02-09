import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { getUserData } from "@/services/userService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userData: any | null;
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
  const [userData, setUserData] = useState<any | null>(null);

  const setAuth = (authUser: User | null, authSession: Session | null = null) => {
    setUser(authUser);
    setSession(authSession);
  };

  const signOutUser = async () => {
    console.log("calling Sign out user...");
    await supabase.auth.signOut();
    console.log("Sign out complete, clearing auth state...");
    setUser(null);
    setSession(null);
    setUserData(null);
  };

  // Fetch custom user data
  const fetchUserData = async (currentUser: User) => {
    try {
      const data = await getUserData(currentUser.id);
      setUserData(data);
      console.log("Fetched user data after auth change:", data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // Subscribe to Supabase auth changes
  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setSession(session ?? null);

      if (currentUser) {
        await fetchUserData(currentUser);
      }
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setSession(session ?? null);

        if (currentUser) {
          await fetchUserData(currentUser);
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, userData, setAuth, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
