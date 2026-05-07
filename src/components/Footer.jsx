const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:text-left">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-bold">RoomFinder</h2>
          <p className="text-gray-400 mt-2 text-sm">Бронируйте лучшие отели по всему миру.</p>
        </div>
        <div className="text-gray-400 text-sm flex flex-col justify-center">
          <p>&copy; {new Date().getFullYear()} RoomFinder. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;