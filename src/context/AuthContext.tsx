import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  name: string;
  role: string;
  badge: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const defaultUser: User = {
  name: 'Bashir Ahmed Mohamud',
  role: 'Officer',
  badge: 'R001',
  email: 'bashir.ahmed@dowladda.so',
  avatar: 'BA',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gov_auth') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    return localStorage.getItem('gov_auth') === 'true' ? defaultUser : null;
  });

  const login = (email: string) => {
    if (email) {
      setIsAuthenticated(true);
      setUser(defaultUser);
      localStorage.setItem('gov_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('gov_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
