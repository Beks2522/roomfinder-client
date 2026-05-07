import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import HotelCard from '../components/HotelCard'; 
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab]);

  const fetchFavorites = async () => {
    setFavLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/favorites/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (err) {
      console.error('Ошибка загрузки избранного', err);
    } finally {
      setFavLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Оплачено</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Отменено</span>;
      default: return <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">В обработке</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-gray-900 font-sans">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-950">Личный кабинет</h1>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12 flex items-center gap-8">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md shadow-blue-200">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-950">{user?.name}</h2>
          <p className="text-gray-500 text-lg">{user?.email}</p>
        </div>
      </div>
      <div className="flex gap-2 border-b border-gray-200 mb-10">
        <button onClick={() => setActiveTab('bookings')} className={`pb-4 px-4 text-lg font-bold transition relative ${activeTab === 'bookings' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'}`}>
          Мои бронирования
          {activeTab === 'bookings' && <div className="absolute -bottom-px left-0 w-full h-1 bg-blue-600 rounded-t-lg"></div>}
        </button>
        <button onClick={() => setActiveTab('favorites')} className={`pb-4 px-4 text-lg font-bold transition relative ${activeTab === 'favorites' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'}`}>
          Избранное
          {activeTab === 'favorites' && <div className="absolute -bottom-px left-0 w-full h-1 bg-blue-600 rounded-t-lg"></div>}
        </button>
      </div>
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {bookingsLoading ? (
            <p className="text-gray-500 animate-pulse">Загрузка поездок...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">У вас пока нет активных бронирований.</p>
            </div>
          ) : (
            bookings.map(b => (
              <div 
                key={b.id} 
                onClick={() => setSelectedBooking(b)}
                className="flex flex-col sm:flex-row bg-white p-4 rounded-3xl shadow-sm border border-gray-100 gap-6 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-300 group items-center sm:items-stretch"
              >
                <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden rounded-2xl relative">
                  <img src={b.hotels?.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="" />
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition duration-300 flex items-center justify-center">
                     <span className="bg-white/90 text-blue-900 font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 shadow-sm backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0">Открыть билет</span>
                  </div>
                </div>
                
                <div className="grow py-2 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="font-extrabold text-2xl text-gray-950 group-hover:text-blue-600 transition mb-1">{b.hotels?.name}</h3>
                    <p className="text-gray-500 mb-4 flex items-center gap-1">📍 {b.hotels?.city}</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
                        <span className="text-gray-400 block text-xs uppercase mb-0.5">Заезд</span>
                        {new Date(b.check_in).toLocaleDateString('ru-RU')}
                      </div>
                      <span className="text-gray-300">—</span>
                      <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-sm font-medium text-gray-700">
                        <span className="text-gray-400 block text-xs uppercase mb-0.5">Выезд</span>
                        {new Date(b.check_out).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto shrink-0 py-2 sm:pr-4 flex flex-row sm:flex-col justify-between items-center sm:items-end border-t border-gray-100 sm:border-t-0 pt-4 sm:pt-0">
                  {getStatusBadge(b.status)}
                  <p className="text-blue-600 font-extrabold text-3xl mt-auto">₸{b.total_price} </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favLoading ? (
            <p className="text-gray-500 col-span-full text-center py-10">Загрузка вашего списка...</p>
          ) : favorites.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4 text-lg">Вы еще не добавили ни одного отеля в избранное.</p>
              <Link to="/hotels" className="text-blue-600 font-bold hover:underline text-lg">Перейти к отелям</Link>
            </div>
          ) : (
            favorites.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} isFavoriteInitial={true} />
            ))
          )}
        </div>
      )}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-6 text-white text-center relative border-b-2 border-dashed border-blue-700">
              <h2 className="text-2xl font-bold mb-1">Электронный ваучер</h2>
              <p className="text-blue-200 text-sm">Варрант на заселение. Покажите на ресепшене</p>
              <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl transition">&times;</button>
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-950/70 rounded-full transform -translate-y-1/2 backdrop-blur-sm"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-950/70 rounded-full transform -translate-y-1/2 backdrop-blur-sm"></div>
            </div>
            <div className="p-8 text-center border-b border-gray-100 flex flex-col items-center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedBooking.id}`} alt="QR Code" className="w-48 h-48 mb-4 border border-gray-200 p-2 rounded-xl shadow-inner" />
              <p className="text-xs text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-full">ID: {selectedBooking.id.split('-')[0]}...</p>
            </div>
            <div className="p-7 bg-gray-50 space-y-5">
              <div><p className="text-sm text-gray-500 mb-1">Гость</p><p className="font-bold text-gray-950 text-xl">{user?.name}</p></div>
              <hr className="border-gray-200" />
              <div><p className="text-sm text-gray-500 mb-1">Отель</p><p className="font-bold text-gray-950 text-xl">{selectedBooking.hotels?.name}</p></div>
              <div className="flex justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
                <div><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Заезд</p><p className="font-bold text-lg">{new Date(selectedBooking.check_in).toLocaleDateString('ru-RU')}</p></div>
                <div className="text-right"><p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Выезд</p><p className="font-bold text-lg">{new Date(selectedBooking.check_out).toLocaleDateString('ru-RU')}</p></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                 {getStatusBadge(selectedBooking.status)}
                 <p className="text-3xl font-bold text-blue-600">${selectedBooking.total_price}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;