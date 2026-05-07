import { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const token = session.access_token;
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'Гость',
          email: session.user.email,
          role: 'user' // Даем обычную роль
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    await supabase.auth.signOut(); 
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};