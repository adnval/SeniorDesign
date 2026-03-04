import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { getUserData, updateUser } from "@/services/userService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userData: any | null;
  signOutUser: () => Promise<void>;
  updateUserData: (newData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<any | null>(null);

  const fetchUserData = async (currentUser: User) => {
    try {
      const result = await getUserData(currentUser.id);
      if (result.success) {
        setUserData(result.data);
      } else {
        setUserData(null);
      }
    } catch (err) {
      setUserData(null);
    }
  };

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("AUTH EVENT:", _event, "user:", session?.user?.id ?? "null");
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setSession(session ?? null);

        if (currentUser) {
          // defer fetchUserData to next tick so auth lock is released first
          setTimeout(() => fetchUserData(currentUser), 0);
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signOutUser = async () => {
    if (!user) {
      console.warn("No user is currently signed in.");
      return;
    }
    await supabase.auth.signOut();
  };

  const updateUserData = async (newData: any) => {
    if (!user) return;
    const result = await updateUser(user.id, newData);
    if (result.success) {
      setUserData((prev: any) => ({ ...prev, ...newData }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, userData, signOutUser, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};