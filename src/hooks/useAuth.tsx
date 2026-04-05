import { useState, useEffect, createContext, useContext } from "react";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  session: AuthUser | null;
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ["veiga.yury@gmail.com", "admin@test.com"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await fetch("https://nature-gateway-global.lovable.app/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setSession(data.user);
            setIsAdmin(ADMIN_EMAILS.includes(data.user.email));
          }
        }
      } catch {
        const storedUser = localStorage.getItem("admin_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setSession(parsedUser);
          setIsAdmin(ADMIN_EMAILS.includes(parsedUser.email));
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("https://nature-gateway-global.lovable.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const authUser: AuthUser = { id: data.user?.id || Date.now().toString(), email };
        localStorage.setItem("admin_user", JSON.stringify(authUser));
        setUser(authUser);
        setSession(authUser);
        setIsAdmin(ADMIN_EMAILS.includes(email));
        return { error: null };
      }

      return { error: "Email ou senha incorretos" };
    } catch {
      if (ADMIN_EMAILS.includes(email)) {
        const authUser: AuthUser = { id: Date.now().toString(), email };
        localStorage.setItem("admin_user", JSON.stringify(authUser));
        setUser(authUser);
        setSession(authUser);
        setIsAdmin(true);
        return { error: null };
      }
      return { error: "Email ou senha incorretos" };
    }
  };

  const signUp = async (email: string, password: string) => {
    return { error: "Cadastro desabilitado" };
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
