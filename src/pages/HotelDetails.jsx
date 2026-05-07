import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Wifi, Snowflake, Car, Utensils, Waves, Bell, 
  MapPin, Star, ChevronRight, Info, MessageSquare 
} from 'lucide-react';

const createModernMarker = (price) => new L.divIcon({
  className: 'bg-transparent',
  html: `
    <div class="bg-blue-600 text-white font-extrabold px-4 py-2 rounded-2xl shadow-xl border-2 border-white transform -translate-x-1/2 -translate-y-full hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap">
      <span>${price} ₸</span>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
  popupAnchor: [0, -45]
});

const HotelDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState([43.238949, 76.889709]); 

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const defaultAmenities = [
    { name: 'Бесплатный Wi-Fi', icon: <Wifi className="w-5 h-5 text-blue-500" /> },
    { name: 'Кондиционер', icon: <Snowflake className="w-5 h-5 text-blue-500" /> },
    { name: 'Парковка', icon: <Car className="w-5 h-5 text-blue-500" /> },
    { name: 'Ресторан', icon: <Utensils className="w-5 h-5 text-blue-500" /> },
    { name: 'Бассейн', icon: <Waves className="w-5 h-5 text-blue-500" /> },
    { name: 'Круглосуточная стойка', icon: <Bell className="w-5 h-5 text-blue-500" /> }
  ];

  useEffect(() => {
    const fetchHotelAndReviews = async () => {
      try {
        const [hotelRes, reviewsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`)
        ]);
        
        const fetchedHotel = hotelRes.data;
        setHotel(fetchedHotel);
        setReviews(reviewsRes.data);

        if (fetchedHotel.city && fetchedHotel.address) {
          const searchQuery = encodeURIComponent(`${fetchedHotel.city}, ${fetchedHotel.address}`);
          const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
          if (geoRes.data && geoRes.data.length > 0) {
            setCoordinates([parseFloat(geoRes.data[0].lat), parseFloat(geoRes.data[0].lon)]);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setReviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        { hotel_id: id, rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([response.data, ...reviews]);
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при отправке отзыва');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <div className="text-gray-500 font-medium">Загрузка данных об отеле...</div>
    </div>
  );
  
  if (!hotel) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Отель не найден</div>;


  const hotelImage = hotel.image || (hotel.images && hotel.images[0]) || hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="bg-gray-50 min-h-screen pb-24 font-sans text-gray-900 pt-8">
      
    
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="text-sm font-medium text-gray-500 flex flex-wrap gap-2 items-center">
          <Link to="/" className="hover:text-blue-600 transition">Главная</Link> 
          <ChevronRight className="w-4 h-4" />
          <Link to="/hotels" className="hover:text-blue-600 transition">Отели</Link> 
          <ChevronRight className="w-4 h-4" />
          <Link to="/hotels" state={{ filterCity: hotel.city }} className="hover:text-blue-600 transition">{hotel.city}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-bold truncate">{hotel.name}</span>
        </nav>
      </div>

      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{hotel.name}</h1>
              {hotel.stars > 0 && (
                <div className="flex text-yellow-400">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-blue-500" /> 
              {hotel.city}, {hotel.address}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">
                {hotel.rating >= 9 ? 'Превосходно' : hotel.rating > 0 ? 'Хорошо' : 'Новый'}
              </span>
              <div className="bg-blue-600 text-white font-black px-4 py-2 rounded-xl text-xl shadow-md">
                {hotel.rating > 0 ? hotel.rating : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-100 md:h-125 rounded-3xl overflow-hidden shadow-md mb-12 relative">
          <img src={hotelImage} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition duration-700 ease-in-out" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
     
          <div className="w-full lg:w-2/3 space-y-10">
            
           
            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold mb-6 text-gray-900 flex items-center">
                <Info className="w-6 h-6 mr-3 text-blue-600" />
                Об отеле
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                {hotel.description || 'Идеальное место для вашего отдыха. В этом отеле сочетаются современный комфорт и уютная атмосфера. Просторные номера оборудованы всем необходимым для проживания как во время деловой поездки, так и в отпуске.'}
              </p>
            </section>

            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold mb-8 text-gray-900">Главные удобства</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {defaultAmenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition duration-300">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      {item.icon}
                    </div>
                    <span className="font-bold text-gray-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </section>

          
            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold mb-8 text-gray-900 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-blue-600" />
                Расположение
              </h2>
              <div className="h-100 rounded-3xl overflow-hidden border border-gray-100 z-0 relative shadow-sm">
                <MapContainer 
                  center={coordinates} 
                  zoom={15} 
                  scrollWheelZoom={false} 
                  zoomControl={false}
                  style={{ height: '100%', width: '100%', zIndex: 0 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={coordinates} icon={createModernMarker(hotel.price)}>
                    <Popup className="rounded-2xl font-sans border-none shadow-xl">
                      <div className="text-center p-2">
                        <b className="text-gray-900 block mb-1 text-base">{hotel.name}</b>
                        <span className="text-gray-500 text-sm">{hotel.address}</span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </section>

            <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold mb-8 text-gray-900 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
                Отзывы гостей ({reviews.length})
              </h2>
              
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="mb-12 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-inner">
                  <h3 className="font-extrabold text-lg mb-6 text-gray-900">Поделитесь впечатлениями</h3>
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Оценка</label>
                    <select 
                      value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold text-gray-700 cursor-pointer"
                    >
                      <option value="5">5 — Отлично</option>
                      <option value="4">4 — Хорошо</option>
                      <option value="3">3 — Нормально</option>
                      <option value="2">2 — Плохо</option>
                      <option value="1">1 — Ужасно</option>
                    </select>
                  </div>
                  <textarea 
                    value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Что вам понравилось, а что можно улучшить?"
                    rows="4" required
                    className="w-full p-5 border border-gray-200 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium text-gray-700"
                  ></textarea>
                  <button type="submit" disabled={reviewLoading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition w-full sm:w-auto shadow-md">
                    {reviewLoading ? 'Отправка...' : 'Опубликовать отзыв'}
                  </button>
                </form>
              ) : (
                <div className="mb-12 bg-blue-50 p-6 rounded-3xl text-blue-800 border border-blue-100 flex items-center gap-4">
                  <Info className="w-6 h-6 shrink-0" />
                  <p className="font-medium">Пожалуйста, <Link to="/login" className="font-bold underline hover:text-blue-600">войдите в систему</Link>, чтобы оставить отзыв.</p>
                </div>
              )}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 font-medium">
                    Пока нет отзывов. Станьте первым!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-extrabold text-lg">
                            {(review.users?.name || 'Г')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900">{review.users?.name || 'Гость'}</div>
                            <div className="text-sm font-medium text-gray-400">{new Date(review.created_at).toLocaleDateString('ru-RU')}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed font-medium">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
              <div className="flex items-end gap-2 mb-8 border-b border-gray-100 pb-6">
                <span className="text-4xl font-black text-blue-600">₸{hotel.price}</span>
                <span className="text-gray-400 font-bold mb-1">/ за ночь</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Заезд</label>
                    <div className="font-bold text-gray-700">Выберите дату</div>
                  </div>
                  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Выезд</label>
                    <div className="font-bold text-gray-700">Выберите дату</div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Гости</label>
                  <div className="font-bold text-gray-700">1 номер, 2 взрослых</div>
                </div>
              </div>

              <Link 
                to={`/booking/${hotel.id}`} 
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-5 rounded-2xl transition duration-300 shadow-md shadow-blue-600/30 mb-4"
              >
                Забронировать номер
              </Link>
              <p className="text-center text-xs font-bold text-gray-400">С вас пока не будет списана оплата</p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default HotelDetails;