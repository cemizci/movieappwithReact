import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import { FiHeart, FiTrash2 } from 'react-icons/fi';


const Favorites = () => {

  const { favorites, clearFavorites} = useFavorites();
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-black pt-24 pb-12'>
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='text-white text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3'>
                <FiHeart className="text-red-800" />
                Listem
            </h1>
            <p className='text-gray-400'>
               {favorites.length > 0 ? (
                <>
                  <span className='text-white font-semibold'>
                    {favorites.length} Favorilerde
                  </span>              
                </>
               ) : (
                'Henüz favorilere film eklemediniz'
               )}
            </p>
          </div>

          {/* Clear All Button */}
          {favorites.length > 0 && (
            <button
              onClick={() => {
                if(window.confirm('Tüm favorileri silmek istediğinize emin misiniz?')){
                  clearFavorites();
                }
              }}
              className='flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-all border border-red-600/30'
            >
              <FiTrash2 size={18} />
              <span>Tümünü Temizle</span>
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
              {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
          </div>
        ) : (
          /* Empty State */
          <div className='text-center p-20'>
            <div className='text-gray-500 mb-6'>
               <FiHeart size={100} className="mx-auto mb-6 text-netflix-lightGray" />
               <h2 className='text-white text-2xl font-bold mb-3'>
                  Favori Listeniz Boş
               </h2>
               <p className='text-gray-400 mb-6 max-w-md mx-auto'>
                  Beğendiğiniz filmleri ekleyerek kişisel bir koleksiyon oluşturun.
                  Film kartlarındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
               </p>
               <button
                onClick={() => navigate('/')}
                className='px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-all font-semibold'
               >
                 Filmleri Keşfet 
               </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-netflix-darkGray rounded-lg p-6 border border-netflix-lightGray">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              💡 İpucu
            </h3>
            <p className="text-gray-400 text-sm">
              Favorileriniz cihazınızda saklanır. Tarayıcı verilerini temizlerseniz
              favorileriniz silinecektir. Film kartındaki kalp ikonuna tekrar tıklayarak
              favorilerden çıkarabilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites