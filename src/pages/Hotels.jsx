import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import HotelCard from '../components/HotelCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, ChevronDown, MapPin } from 'lucide-react';

const modernMarker = new L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-md"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const Hotels = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [selectedCity, setSelectedCity] = useState('Все города');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const mapCenter = [43.238949, 76.889709];

  const fetchHotelsAndFavs = async (currentPage = 1) => {
    if (currentPage === 1) setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [hotelsRes, favsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/hotels?page=${currentPage}&limit=6`),
        token && currentPage === 1 ? axios.get(`${import.meta.env.VITE_API_URL}/api/favorites/my`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
        : Promise.resolve({ data: [] })
      ]);
      
      if (currentPage === 1) {
        setHotels(hotelsRes.data);
        if (token) setFavoriteIds(favsRes.data.map(h => h.id));
      } else {
        setHotels(prev => [...prev, ...hotelsRes.data]);
      }

      setHasMore(hotelsRes.data.length === 6);
      
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelsAndFavs(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHotelsAndFavs(nextPage);
  };

  useEffect(() => {
    if (location.state?.filterCity) {
      setSelectedCity(location.state.filterCity);
    }
  }, [location.state]);

  const uniqueCities = ['Все города', ...new Set(hotels.map(h => h.city))];

  const filteredHotels = hotels.filter(hotel => {
    const matchCity = selectedCity === 'Все города' || hotel.city === selectedCity;
    const matchMin = minPrice === '' || hotel.price >= Number(minPrice);
    const matchMax = maxPrice === '' || hotel.price <= Number(maxPrice);
    return matchCity && matchMin && matchMax;
  });

 
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row animate-pulse">
      <div className="w-full md:w-72 h-56 md:h-auto bg-gray-200"></div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
          <div className="flex gap-3">
            <div className="h-8 bg-gray-200 rounded-xl w-20"></div>
            <div className="h-8 bg-gray-200 rounded-xl w-24"></div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-6">
          <div className="h-8 bg-gray-200 rounded-md w-24"></div>
          <div className="h-12 bg-gray-200 rounded-2xl w-40"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-8 pb-12">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
      
          <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 sticky top-28 shadow-sm">
              <div className="flex items-center mb-6">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                <h2 className="font-extrabold text-lg text-gray-900">Фильтры</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Город</label>
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)} 
                    className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none"
                  >
                    {uniqueCities.map((city, idx) => <option key={idx} value={city}>{city}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Цена за ночь (₸)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      placeholder="От" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)} 
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition" 
                    />
                    <span className="text-gray-300 font-bold">-</span>
                    <input 
                      type="number" 
                      placeholder="До" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)} 
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Тип жилья</label>
                  <div className="space-y-3">
                    {['Отели', 'Апартаменты', 'Хостелы'].map((type) => (
                      <label key={type} className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition cursor-pointer" />
                          <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="ml-3 text-sm font-bold text-gray-600 group-hover:text-blue-600 transition">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="w-full lg:w-2/4 xl:w-2/5 grow">
            {loading && page === 1 ? (
              <div className="flex flex-col gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Ничего не найдено</h3>
                <p className="text-gray-500 font-medium">Попробуйте изменить город или расширить бюджет.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredHotels.map(hotel => (
                  <HotelCard 
                    key={hotel.id} 
                    hotel={hotel} 
                    isFavoriteInitial={favoriteIds.includes(hotel.id)} 
                  />
                ))}
                
                {hasMore && !loading && (
                  <button 
                    onClick={handleLoadMore}
                    className="mt-4 bg-white border-2 border-gray-200 text-gray-900 font-bold py-4 rounded-3xl hover:bg-gray-50 hover:border-gray-300 transition duration-300 shadow-sm w-full"
                  >
                    Показать больше вариантов
                  </button>
                )}
                
                {loading && page > 1 && (
                  <div className="flex justify-center py-6">
                     <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}
          </main>

          <aside className="hidden xl:block w-2/5 shrink-0 z-0">
            <div className="sticky top-28 h-[calc(100vh-140px)] bg-gray-200 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              
     
              <MapContainer 
                center={mapCenter} 
                zoom={12} 
                scrollWheelZoom={true} 
                zoomControl={false} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
                />
                
                <Marker position={mapCenter} icon={modernMarker}>
                  <Popup className="rounded-xl font-sans">
                    <b className="text-gray-900 block mb-1">Зона поиска</b>
                    <span className="text-gray-500 text-sm">{selectedCity}</span>
                  </Popup>
                </Marker>

               
                {filteredHotels.map(hotel => {
                  const lat = hotel.lat || mapCenter[0] + (Math.random() - 0.5) * 0.05;
                  const lng = hotel.lng || mapCenter[1] + (Math.random() - 0.5) * 0.05;

                  const priceMarker = new L.divIcon({
                    className: 'bg-transparent',
                    html: `<div class="bg-white text-gray-900 font-extrabold text-sm px-3 py-1.5 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition cursor-pointer whitespace-nowrap">
                             ${hotel.price} ₸
                           </div>`,
                    iconSize: null, // null означает автоматический размер плашки
                    iconAnchor: [20, 15],
                  });

                  return (
                    <Marker key={hotel.id} position={[lat, lng]} icon={priceMarker}>
                      <Popup className="rounded-2xl">
                        <div className="font-sans w-48">
                           <img src={hotel.image_url} className="w-full h-24 object-cover rounded-t-lg mb-2" alt={hotel.name}/>
                           <b className="text-gray-900 block truncate">{hotel.name}</b>
                           <span className="text-blue-600 font-bold">{hotel.price} ₸ / ночь</span>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Hotels;