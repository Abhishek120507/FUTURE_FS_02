import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextValue {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_EMAIL = 'admin@minicrm.com';
const ADMIN_PASSWORD = 'minicrm@2026';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('minicrm_user');
    if (stored) {
      setUser({ email: stored });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('minicrm_user', email);
      setUser({ email });
      return { error: null };
    }
    return { error: 'Invalid email or password' };
  };

  const signOut = async () => {
    localStorage.removeItem('minicrm_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
