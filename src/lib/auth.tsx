import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, User } from './database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: 'recruiter' | 'applicant') => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored session
    const storedUserId = localStorage.getItem('talentflow_user_id');
    if (storedUserId) {
      db.users.get(parseInt(storedUserId)).then((user) => {
        if (user) {
          setUser(user);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await db.users
        .where('email')
        .equals(email)
        .and((user) => user.password === password)
        .first();

      if (user) {
        setUser(user);
        localStorage.setItem('talentflow_user_id', user.id!.toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: 'recruiter' | 'applicant'
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check for existing user
      const existing = await db.users.where('email').equals(email).first();
      if (existing) {
        setIsLoading(false);
        return false;
      }
      const id = await db.users.add({
        email,
        password,
        name,
        role,
        createdAt: new Date(),
      });
      const newUser = await db.users.get(id);
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('talentflow_user_id', id.toString());
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('talentflow_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}