import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ThumbsUp, Globe, MessageSquare } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-blue-600 to-blue-900/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Ооооочень много отелей и квартир!
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
            Бронируйте жилье по всему миру с комфортом и без переплат.
          </p>

          <div className="bg-white p-2 rounded-3xl md:rounded-full max-w-5xl mx-auto flex flex-col md:flex-row items-center shadow-2xl border border-white/20">
            
            <div className="flex-1 flex items-center px-6 py-4 md:py-2 w-full border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 rounded-t-2xl md:rounded-l-full md:rounded-tr-none transition cursor-text">
              <MapPin className="text-gray-400 w-6 h-6 mr-3 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Направление</span>
                <input type="text" placeholder="Куда едем?" className="w-full outline-none text-gray-900 font-medium bg-transparent placeholder-gray-400 truncate" />
              </div>
            </div>

            <div className="flex-1 flex items-center px-6 py-4 md:py-2 w-full border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 transition cursor-pointer">
              <Calendar className="text-gray-400 w-6 h-6 mr-3 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Даты</span>
                <span className="text-gray-900 font-medium truncate">Заезд — Выезд</span>
              </div>
            </div>

            <div className="flex-1 flex items-center px-6 py-4 md:py-2 w-full hover:bg-gray-50 rounded-b-2xl md:rounded-r-full md:rounded-bl-none transition cursor-pointer">
              <Users className="text-gray-400 w-6 h-6 mr-3 shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Гости</span>
                <span className="text-gray-900 font-medium">1 гость</span>
              </div>
            </div>

            <button className="w-full md:w-auto mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl md:rounded-full transition duration-300 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
              <Search className="w-5 h-5 mr-2" />
              Найти
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          
          <div className="flex flex-col items-start">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <ThumbsUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Низкие цены</h3>
            <p className="text-gray-500 leading-relaxed">
              Мы работаем напрямую с тысячами отелей и контролируем цены на номера, чтобы предлагать вам лучшие варианты.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Globe className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Отели по всему миру</h3>
            <p className="text-gray-500 leading-relaxed">
              У нас огромный выбор вариантов размещения: отели, хостелы, апартаменты и виллы. Найдется всё!
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <MessageSquare className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Заботливая поддержка 24/7</h3>
            <p className="text-gray-500 leading-relaxed">
              Операторы поддержки помогут с выбором отеля и бронированием. Мы всегда на связи и готовы помочь.
            </p>
          </div>

        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Популярные направления</h2>
          <Link to="/hotels" className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition hidden sm:block">
            Смотреть все отели
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Карточка: Алматы */}
          <Link to="/hotels" state={{ filterCity: 'Алматы' }} className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition duration-300">
            <img 
              src="https://yandex-images.clstorage.net/1Mg00F315/ffc4c1ibGO/flgyeuJUuVF9MUyZxzVBJsNffmfiRBV0LFbEOpe-eYxMRHlFYV5TijbiAq1ylbW3kxaGRTyTrzNND5cLJcCm3jgIfjalFaQPIHRUzc82RCTeAj12_h4RKTYUlzLHukDlOzADLR81efwanRr7JcLm-NwfxS1ShNcWGVOJe37r6IVwSB5c1EXGdXcnD4nvMmAxzwVHbdsKFA8GQIpokch-1Qg8CTQBD173IZQKzzPo7O2CMfIBSe7NEypoq0t09OigUE8rf9Frzm93EReO5xNgN_QwaUvFKhgKFHiPR6fmadQIKzUeNT9g0BebAOMN9vvCmgbUCmzs7ScKaLdzRPXGl0NtEWLCavpfdCYSi8AaTTL1NHNm-R0GMgpbs3ef-lLYNj4SIwYRcv08ijPOMurHx6YC-RdF1NAZO1W6fljO0qppdgFj-2bjS38TK4_CNWEk7hB-c_UONS0EWZRZoehryTY2OyAYLUPUNoIb1T3z78GoOPg8XcXpNjJSuEJfwvW9QmELY-hEwEVsFQSQ3hdgJsoSckn7Ehk8D2W1SbPjadAtHxcePBNcyRKhCPEt7_PTgjnTNl3C8hQIX6Jpe9_Tt2ZvHFzZTtJ7aScysOoCYTX_J1h04QEaBy13k0a95VHREjUIBAgEU_w6uyD7D-T09oseyAZj1MsRMXWTUlDL3J1MWCxS1ULHS1YXG6LuM0QTyxpxVPs7OwEEZY1Fk9l91xULBAY2EnvIJr8a8D3VzMieO_QaZN7cBxZym2Bz9-2BaXYUbsZsx3hAISyNwgxXN8IgaGzkJSY-LF2BV6LTXd4zEwAZCSRd0SaXINcG6-TLmxbcJmjmyBUWeLJxec7viVpLPnL4b9J7bRs0h-4daCX_IkFS5h8zAwNamkaX6EvKLSE3ISA_Rc07iQHRP_PTwpkf6yFCwvMxFUCJXkbW6qB4SRFM1FHhc2skOLbLE1wP3ilDb8Y8PwIGSLRZvcM" 
              alt="Алматы" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-sm font-bold text-blue-300 uppercase tracking-wider block mb-1">Казахстан</span>
              <span className="text-2xl font-extrabold text-white">Алматы</span>
            </div>
          </Link>

          {/* Карточка: Астана */}
          <Link to="/hotels" state={{ filterCity: 'Астана' }} className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition duration-300">
            <img 
              src="https://avatars.mds.yandex.net/i?id=a42e793cb743c32c8798a8aba8559a78097d90f3-5390729-images-thumbs&n=13" 
              alt="Астана" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-sm font-bold text-blue-300 uppercase tracking-wider block mb-1">Казахстан</span>
              <span className="text-2xl font-extrabold text-white">Астана</span>
            </div>
          </Link>

          {/* Дополнительные карточки для красоты сетки (можно заменить на свои города) */}
          <Link to="/hotels" state={{ filterCity: 'Шымкент' }} className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition duration-300">
            <img 
              src="https://avatars.mds.yandex.net/i?id=d52b40edd28b05a76d6f4bbbf05e8654b9cdcf17-4210399-images-thumbs&n=13" 
              alt="Шымкент" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-sm font-bold text-blue-300 uppercase tracking-wider block mb-1">Казахстан</span>
              <span className="text-2xl font-extrabold text-white">Шымкент</span>
            </div>
          </Link>

          <Link to="/hotels" className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition duration-300 bg-blue-600 flex flex-col items-center justify-center p-6 text-center hover:bg-blue-700">
            <MapPin className="w-12 h-12 text-white mb-4 opacity-80 group-hover:scale-110 transition" />
            <span className="text-xl font-extrabold text-white mb-2">Все направления</span>
            <span className="text-sm text-blue-200">Откройте для себя весь мир</span>
          </Link>

        </div>
        
        <div className="mt-6 sm:hidden text-center">
           <Link to="/hotels" className="text-blue-600 font-bold hover:underline">
             Смотреть все отели →
           </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;