import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import supabase from '../config/supabaseClient'; // Добавили импорт клиента Supabase

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, formData);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  // Новая функция для авторизации через Google
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/profile' 
        }
      });
      
      if (error) throw error;
    } catch (err) {
      console.error('Ошибка входа через Google:', err.message);
      setError('Не удалось войти через Google');
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">С возвращением!</h2>
          <p className="text-gray-500 mt-2">Войдите в свой аккаунт для бронирования</p>
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 hover:bg-white transition" 
              placeholder="ваша@почта.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Пароль</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50 hover:bg-white transition" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-blue-200 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition duration-300"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {/* Разделитель "или" */}
        <div className="my-8 flex items-center gap-4">
          <hr className="w-full border-gray-200" />
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">или</span>
          <hr className="w-full border-gray-200" />
        </div>

        {/* Кнопка входа через Google */}
        <button 
          onClick={handleGoogleLogin} 
          type="button" 
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition duration-300 shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Продолжить с Google
        </button>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;