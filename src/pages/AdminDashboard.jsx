import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('hotels');
  const [formData, setFormData] = useState({ name: '', city: '', address: '', price: '', stars: '5', description: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [hotelsList, setHotelsList] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'hotels') {
      fetchHotels();
    }
  }, [activeTab]);

  const fetchHotels = async () => {
    setHotelsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels`);
      setHotelsList(response.data);
    } catch (err) {
      console.error('Ошибка загрузки отелей', err);
    } finally {
      setHotelsLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ text: 'Пожалуйста, выберите фото отеля', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    const data = new FormData();
    data.append('name', formData.name);
    data.append('city', formData.city);
    data.append('address', formData.address);
    data.append('price', formData.price);
    data.append('stars', formData.stars);
    data.append('description', formData.description);
    data.append('image', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/hotels`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      setMessage({ text: 'Отель успешно добавлен!', type: 'success' });
      setFormData({ name: '', city: '', address: '', price: '', stars: '5', description: '' });
      setFile(null); 
      fetchHotels(); 
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Ошибка при добавлении', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отель? Это действие необратимо.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setHotelsList(hotelsList.filter(h => h.id !== hotelId));
      alert('Отель успешно удален');
    } catch (err) {
      alert('Ошибка при удалении отеля');
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (err) {
      console.error('Ошибка загрузки бронирований', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert('Ошибка при обновлении статуса');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-center py-20 text-xl text-red-600">Доступ запрещен!</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Подтверждено</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Отменено</span>;
      case 'completed': return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Завершено</span>;
      default: return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <h1 className="text-3xl font-extrabold text-gray-950 mb-8">Панель администратора</h1>
      
      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setActiveTab('hotels')}
          className={`px-6 py-2.5 rounded-xl font-bold transition ${activeTab === 'hotels' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Управление отелями
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-2.5 rounded-xl font-bold transition ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Управление заказами
        </button>
      </div>

      {activeTab === 'hotels' && (
        <div className="space-y-8">
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-4xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-950">Новый отель</h2>
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleHotelSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Название отеля</label>
                  <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Город</label>
                  <input name="city" value={formData.city} onChange={handleChange} required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Точный адрес</label>
                <input name="address" value={formData.address} onChange={handleChange} required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Цена (₸)</label>
                  <input name="price" value={formData.price} onChange={handleChange} required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Звезды</label>
                  <select name="stars" value={formData.stars} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition cursor-pointer">
                    <option value="5">5 звезд</option>
                    <option value="4">4 звезды</option>
                    <option value="3">3 звезды</option>
                    <option value="2">2 звезды</option>
                    <option value="1">1 звезда</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Фото отеля</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full px-3 py-2.5 text-sm text-gray-500 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Описание</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition resize-none"></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition shadow-lg shadow-blue-200">
                {loading ? 'Загрузка...' : 'Добавить отель в базу'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-950">Существующие отели</h2>
            {hotelsLoading ? (
              <p className="text-gray-500 animate-pulse">Загрузка списка отелей...</p>
            ) : hotelsList.length === 0 ? (
              <p className="text-gray-500 bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">В базе пока нет отелей.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                {hotelsList.map(h => (
                  <div key={h.id} className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition group">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <img src={h.image} className="w-20 h-20 object-cover rounded-xl shrink-0 border border-gray-200" alt="" />
                      <div>
                        <p className="font-bold text-gray-950 text-lg mb-1">{h.name}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">📍 {h.city}</span>
                           <span className="text-sm font-bold text-blue-600">₸{h.price} / ночь</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteHotel(h.id)}
                      className="mt-4 sm:mt-0 w-full sm:w-auto text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
                      title="Удалить отель"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-1.8c0-.663-.537-1.2-1.2-1.2h-3.6c-.663 0-1.2.537-1.2 1.2v1.8m7.5 0a48.112 48.112 0 0 0-7.5 0" />
                      </svg>
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
          {bookingsLoading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse">Загрузка заказов...</div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Пока нет ни одного заказа.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-5 font-bold text-gray-600 uppercase tracking-wider text-xs">Отель</th>
                    <th className="p-5 font-bold text-gray-600 uppercase tracking-wider text-xs">Клиент</th>
                    <th className="p-5 font-bold text-gray-600 uppercase tracking-wider text-xs">Даты</th>
                    <th className="p-5 font-bold text-gray-600 uppercase tracking-wider text-xs">Сумма</th>
                    <th className="p-5 font-bold text-gray-600 uppercase tracking-wider text-xs">Статус</th>
                    <th className="p-5 font-bold text-gray-600 uppercase tracking-wider text-xs">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-blue-50/50 transition">
                      <td className="p-5">
                        <div className="font-extrabold text-gray-950">{booking.hotels?.name}</div>
                        <div className="text-sm text-gray-500">📍 {booking.hotels?.city}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{booking.users?.name}</div>
                        <div className="text-sm text-gray-500">{booking.users?.email}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg inline-block border border-gray-100">
                          {new Date(booking.check_in).toLocaleDateString('ru-RU')} <br/> 
                          <span className="text-gray-300">↓</span> <br/>
                          {new Date(booking.check_out).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                      <td className="p-5 font-extrabold text-blue-600 text-lg">
                        ₸{booking.total_price}
                      </td>
                      <td className="p-5">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="p-5">
                        <select 
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-sm font-bold border border-gray-200 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer hover:bg-gray-50 transition"
                        >
                          <option value="confirmed">Подтвердить</option>
                          <option value="completed">Завершить</option>
                          <option value="cancelled">Отменить</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;