import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Car, MapPin } from 'lucide-react';
import axios from 'axios'; 

const HotelCard = ({ hotel, isFavoriteInitial }) => {
 
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);

  const hotelImage = hotel.image || (hotel.images && hotel.images[0]) || hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";


  const handleFavoriteClick = async (e) => {
    e.preventDefault(); 
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Пожалуйста, авторизуйтесь для добавления в избранное');
        return;
      }

     
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/favorites`, 
        { hotel_id: hotel.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      setIsFavorite(!isFavorite);

    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
      alert('Не удалось добавить в избранное');
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row group">
      <div className="relative w-full sm:w-56 md:w-64 lg:w-72 h-56 sm:h-auto shrink-0 overflow-hidden">
        <img 
          src={hotelImage} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isFavorite ? "currentColor" : "currentColor"} className={`w-5 h-5 ${isFavorite ? 'text-red-500' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-5 lg:p-6 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex flex-wrap justify-between items-start mb-2 gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg lg:text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {hotel.name}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1 text-blue-500 shrink-0" />
                <span className="truncate">{hotel.city}{hotel.address ? `, ${hotel.address}` : ''}</span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-1.5">
                 <span className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-tighter hidden sm:block">
                   {hotel.rating >= 9 ? 'Превосходно' : hotel.rating > 0 ? 'Хорошо' : 'Новый'}
                 </span>
                 <div className="bg-blue-600 text-white font-bold px-2 py-1 rounded-lg text-sm">
                   {hotel.rating > 0 ? hotel.rating : '—'}
                 </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex items-center text-xs font-bold text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
              <Wifi className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              Wi-Fi
            </div>
            <div className="flex items-center text-xs font-bold text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
              <Car className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              Парковка
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between mt-5 pt-4 border-t border-gray-50 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Цена за ночь</span>
            <span className="text-xl lg:text-2xl font-extrabold text-gray-900">₸{hotel.price}</span>
          </div>
          <Link 
            to={`/hotel/${hotel.id}`} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-2xl transition duration-300 shadow-md shadow-blue-600/20 text-sm text-center whitespace-nowrap w-full sm:w-auto"
          >
            Выбрать номер
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;