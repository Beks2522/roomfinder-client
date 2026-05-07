import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`);
        setHotel(response.data);
      } catch (err) {
        setError('Не удалось загрузить данные отеля.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);
  useEffect(() => {
    if (checkIn && checkOut && hotel) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end > start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
        setTotalPrice(diffDays * hotel.price);
        setError('');
      } else {
        setNights(0);
        setTotalPrice(0);
        setError('Дата выезда должна быть позже даты заезда.');
      }
    }
  }, [checkIn, checkOut, hotel]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return setError('Пожалуйста, выберите даты.');
    if (nights <= 0) return;

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        { hotel_id: id, check_in: checkIn, check_out: checkOut, total_price: totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при оформлении бронирования');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Подготовка к бронированию...</div>;
  if (!hotel) return <div className="min-h-screen flex items-center justify-center text-red-500">Отель не найден</div>;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-[#f5f7fa] min-h-screen py-12 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-10">Оформление бронирования</h1>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 text-blue-950">Ваши данные</h2>
              
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">На этот email будет отправлен электронный ваучер</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-blue-950">Даты поездки</h2>
              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">{error}</div>}
              
              <form onSubmit={handleBooking}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Заезд</label>
                    <input 
                      type="date" 
                      min={today}
                      value={checkIn} 
                      onChange={(e) => setCheckIn(e.target.value)} 
                      required 
                      className="w-full p-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Выезд</label>
                    <input 
                      type="date" 
                      min={checkIn || today}
                      value={checkOut} 
                      onChange={(e) => setCheckOut(e.target.value)} 
                      required 
                      className="w-full p-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8 mt-4">
                  <button 
                    type="submit" 
                    disabled={submitting || nights <= 0} 
                    className="w-full bg-blue-600 text-white font-bold text-xl py-5 rounded-2xl hover:bg-blue-700 disabled:bg-blue-300 transition shadow-lg shadow-blue-200"
                  >
                    {submitting ? 'Оформляем...' : 'Подтвердить и забронировать'}
                  </button>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Нажимая кнопку, вы соглашаетесь с правилами сервиса.
                  </p>
                </div>
              </form>
            </div>
          </div>
          <aside className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Детали бронирования</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img src={hotel.image} alt={hotel.name} className="w-24 h-24 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-1">{hotel.name}</h4>
                  <p className="text-sm text-gray-500">📍 {hotel.city}</p>
                  <div className="text-yellow-400 text-xs mt-1 tracking-widest">{'★'.repeat(hotel.stars || 5)}</div>
                </div>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Заезд</span>
                  <span className="font-bold text-gray-900">{checkIn ? new Date(checkIn).toLocaleDateString('ru-RU') : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Выезд</span>
                  <span className="font-bold text-gray-900">{checkOut ? new Date(checkOut).toLocaleDateString('ru-RU') : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Длительность</span>
                  <span className="font-bold text-gray-900">{nights > 0 ? `${nights} ночей` : '—'}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>₸{hotel.price} x {nights > 0 ? nights : 1} ночей</span>
                  <span>₸{totalPrice || hotel.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Налоги и сборы</span>
                  <span className="text-green-600 font-medium">Включено</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Итого</span>
                <span className="text-4xl font-extrabold text-blue-600">₸{totalPrice || 0}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Booking;