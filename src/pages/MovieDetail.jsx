import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiStar, FiClock, FiCalendar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import {movieApi} from '../services/tmdbApi';
import { getImageUrl, BACKDROP_SIZE } from '../utils/constants';
import { useFavorites } from '../context/FavoritesContext';
import { MovieDetailSkeleton } from '../components/Loading';
import Cast from '../components/Cast';
import VideoPlayer from '../components/VideoPlayer';
import Reviews from '../components/Reviews';
import SimilarMovies from '../components/SimilarMovies';


const MovieDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const {addToFavorites, removeFromFavorites, isFavorite} = useFavorites();

  const [movie,setMovie] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(() => {
    const fetchMovieData =  async () => {
      try {
        setLoading(true);
        const response = await movieApi.getMovieDetail(id);
        setMovie(response.data);
        setError(null);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Error fetching movie details:', err)
        setError('Film bilgileri yüklenirken bir hata oluştu.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData();
  }, [id]);

  const isInFavorites = movie ? isFavorite(movie.id) : false;

  const handleFavoriteClick = () => {
    if(!movie) return;

    if(isInFavorites){
      removeFromFavorites(movie.id)
    }else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      })
    }
  }

  // Runtime formatla (150 dakika -> 2s 30d)
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes/60);
    const mins = minutes % 60;
    return `${hours}s ${mins}d`
  }

  /* 

   // Para formatla
  const formatMoney = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  */

  if (loading){
    return <MovieDetailSkeleton/>
  }

  //Error
  if (error || !movie){
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-500 text-xl mb-4'>{error || 'Film bulunamadı'}</p>
          <button
            onClick={() => navigate('/')}
            className='bg-netflix-red text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors'
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className='min-h-screen bg-black'>
      {/* Backdrop Section */}
      <div className='relative h-[50vh] sm:h-[60vh] lg:h-[80vh]'>
        <img
          src={getImageUrl(movie.backdrop_path, BACKDROP_SIZE)}
          alt={movie.title}
          className='w-full h-full object-cover'
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-netflix-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>

        {/* Back Button */}
        <button
         onClick={() => navigate(-1)}
         className='absolute top-24 left-4 sm:left-8 flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-md hover:bg-black/70 transition-all'
        >
          <FiArrowLeft size={20} />
          <span>Geri</span>
        </button>

        {/* Title & Quick Info */}
        <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12'>
          <div className='max-w-screen-2xl mx-auto'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
              {movie.title}
            </h1>
            <div className='flex flex-wrap items-center gap-4 text-white'>
              <div className='flex items-center gap-2'>
                  <FiStar className="text-yellow-400" size={20} />
                  <span className='font-semibold'>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}      
                  </span>
              </div>
              {movie.release_date && (
                <div className='flex items-center gap-2'>
                  <FiCalendar size={18} />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}

              {movie.runtime && (
                <div className='flex items-center gap-2'>
                  <FiClock size={18} />  
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-8'>
          {/* Overview & Details */}  
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
          {/* Left Column - Overview */}
          <div className='lg:col-span-2'>
             <div className='mb-8'>
              <h2 className='text-white text-2xl font-bold mb-4'>Hikaye</h2>
              <p className='text-gray-300 leading-relaxed text-lg'>
                {movie.overview || 'Açıklama mevcut değil.'}
              </p>
            </div> 

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-8">
                <h3 className='text-white text-xl font-semibold mb-3'>Türler</h3>
                <div className='flex flex-wrap gap-2'>
                    {movie.genres.map((genre)=> (
                      <span 
                      key={genre.id}
                      className='bg-gray-800 text-white px-4 py-2 rounded-md text-sm'
                      >
                        {genre.name}
                      </span>
                    ))}
                </div>
              </div>
            )}  

            {/* Actions */}
            <div className='flex gap-4'>
              <button
                onClick={handleFavoriteClick}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
                  isInFavorites
                    ? 'bg-netflix-red text-white bg-red-700'
                    : 'bg-netflix-lightGray text-white hover:bg-gray-600'
                }`}
              >
                {isInFavorites ? (
                  <>
                  <FaHeart size={20} />
                  <span>Listemde</span>
                  </>
                ) : (
                  <>
                    <FiHeart size={20} />
                    <span>Listeme Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className='lg:col-span-1'>
             <div className='bg-gray-900 rounded-lg p-6'>
              <h3 className="text-white text-xl font-semibold mb-4">Film Bilgileri</h3>
              <div className='space-y-4'>
                {/* Original Title */}
                {movie.original_title && movie.original_title !== movie.title && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Orijinal İsim</p>
                    <p className="text-white">{movie.original_title}</p>
                  </div> 
                )}

                {/* Status */}
                {movie.status && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Durum</p>
                    <p className="text-white">{movie.status}</p>
                  </div>  
                )}

                {/* Original Language */}
                {movie.original_language && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Orijinal Dil</p>
                    <p className="text-white uppercase">{movie.original_language}</p>
                  </div>
                )}

                {/* Production Companies */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Yapım Şirketleri</p>
                    <div className="text-white">
                      {movie.production_companies.slice(0, 3).map((company) => (
                        <p key={company.id}>{company.name}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
             </div>   
          </div>
          </div> 

          {/* Video Player - Trailer */}
          <VideoPlayer movieId={id}/> 

          {/* Cast */}
          <Cast movieId={id} />

          {/* Reviews */}
          <Reviews movieId={id} />

          {/* Similar Movies */}
          <SimilarMovies movieId={id} />
      </div>
    </div>
  )
}

export default MovieDetail;