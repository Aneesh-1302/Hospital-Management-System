import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Mock users (replace with real API calls once backend is ready) ──
const MOCK_USERS: AuthUser[] = [
  { user_id: 1, role: 'patient', email: 'patient@test.com', name: 'Priyanshu Roy' },
  { user_id: 2, role: 'doctor',  email: 'doctor@test.com',  name: 'Dr. Anjali Sharma' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('shms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string, role: UserRole) => {
    // ── TODO: Replace this block with real API call ──
    // const res = await axios.post('/api/auth/login', { email, password, role });
    // const loggedInUser = res.data.user;
    // localStorage.setItem('shms_token', res.data.token);

    const found = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (!found) throw new Error('Invalid credentials');

    localStorage.setItem('shms_user', JSON.stringify(found));
    setUser(found);
  };

  const logout = () => {
    localStorage.removeItem('shms_user');
    localStorage.removeItem('shms_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};