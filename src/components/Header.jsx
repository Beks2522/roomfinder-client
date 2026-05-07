import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Menu, ShieldCheck } from 'lucide-react'; // Добавили иконку ShieldCheck

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const location = useLocation();

  // Функция для проверки активной ссылки
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* ЛЕВАЯ ЧАСТЬ: Логотип и навигация */}
          <div className="flex items-center gap-10">
            
            {/* Логотип с иконкой */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-blue-700 transition duration-300 shadow-md shadow-blue-600/20">
                RF
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                Room<span className="text-blue-600">Finder</span>
              </span>
            </Link>

            {/* Ссылки (Главная, Отели, Админка) - скрыты на мобильных */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-extrabold uppercase tracking-wide transition-colors duration-200 ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Главная
              </Link>
              <Link
                to="/hotels"
                className={`text-sm font-extrabold uppercase tracking-wide transition-colors duration-200 ${
                  isActive('/hotels') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Отели
              </Link>
              
              {/* СЕКРЕТНАЯ ССЫЛКА: Видна только администраторам */}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide transition-colors duration-200 ${
                    isActive('/admin') ? 'text-purple-700' : 'text-purple-500 hover:text-purple-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Админ-панель
                </Link>
              )}
            </nav>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Профиль и Авторизация */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Кнопка в профиль с аватаркой */}
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-3 hover:bg-gray-50 px-2 py-1.5 rounded-2xl transition duration-300 border border-transparent hover:border-gray-100"
                >
                  <div className={`w-9 h-9 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'} rounded-full flex items-center justify-center font-black text-sm`}>
                    {(user?.name || 'Г')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {user?.name?.split(' ')[0] || 'Профиль'}
                  </span>
                </Link>
                
                {/* Кнопка Выйти */}
                <button
                  onClick={logout}
                  className="flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl transition duration-300"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:block">Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-700 hover:text-blue-600 transition duration-300 hidden sm:block px-3 py-2"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-7 rounded-xl transition duration-300 shadow-md shadow-blue-600/20"
                >
                  Регистрация
                </Link>
              </>
            )}

            {/* Кнопка бургер-меню (для телефонов) */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-xl transition">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;