import { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient'; // Импортируем наш клиент

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Проверяем обычный вход (если токен уже сохранен в браузере)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    // 2. СЛУШАЕМ SUPABASE (МАГИЯ ДЛЯ GOOGLE)
    // Этот код автоматически поймает токен после редиректа от Google
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const token = session.access_token;
        
        // Вытаскиваем данные пользователя, которые отдал Google
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'Гость',
          email: session.user.email,
          role: 'user' // Даем обычную роль
        };
        
        // Сохраняем как при обычном входе
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
      }
    });

    // Очищаем слушатель при размонтировании
    return () => subscription.unsubscribe();
  }, []);

  // Функция для классического входа (по email/паролю)
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Функция выхода
  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    // Выходим и из сессии Supabase (чтобы Google не запоминал нас навсегда)
    await supabase.auth.signOut(); 
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};