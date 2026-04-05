import { useState, useEffect, createContext, useContext } from "react";
import { fetchLovable, insertLovable, LovableProfile } from "@/integrations/lovable/client";

interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  session: AuthUser | null;
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, role?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("admin_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Re-verify role from DB
          const profiles = await fetchLovable<LovableProfile>("profiles");
          const profile = profiles.find(p => p.email === parsedUser.email);
          
          if (profile) {
            setUser({ ...parsedUser, role: profile.role });
            setSession(parsedUser);
            setIsAdmin(profile.role === "admin");
          } else {
            // If profile gone, clear session
            localStorage.removeItem("admin_user");
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    // In this simplified setup, we check if the user exists in profiles
    // In a real app, Supabase Auth handles the password
    try {
      const profiles = await fetchLovable<LovableProfile>("profiles");
      const profile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

      if (profile) {
        const authUser: AuthUser = { id: profile.id, email, role: profile.role };
        localStorage.setItem("admin_user", JSON.stringify(authUser));
        setUser(authUser);
        setSession(authUser);
        setIsAdmin(profile.role === "admin");
        return { error: null };
      }

      return { error: "Usuário não autorizado ou senha incorreta." };
    } catch {
      return { error: "Erro na autenticação." };
    }
  };

  const signUp = async (email: string, password: string, role: string = "user") => {
    try {
      await insertLovable("profiles", { email, role });
      return { error: null };
    } catch (e) {
      return { error: "Erro ao criar usuário." };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("admin_user");
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
