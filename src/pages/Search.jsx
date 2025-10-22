import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { movieApi } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/Loading';
import useDebounce from '../hooks/useDebounce';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Arama yap
  useEffect(() => {
    const searchMovies = async () => {
      if (debouncedSearchQuery.trim() === '') {
        setMovies([]);
        setTotalResults(0);
        return;
      }

      try {
        setLoading(true);
        const response = await movieApi.searchMovies(debouncedSearchQuery);
        setMovies(response.data.results);
        setTotalResults(response.data.total_results);
        
        // URL'i güncelle
        setSearchParams({ query: debouncedSearchQuery });
      } catch (error) {
        console.error('Error searching movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedSearchQuery, setSearchParams]);

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-6">
            Film Ara
          </h1>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <FiSearch 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={24} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Film adı yazın..."
              className="w-full pl-14 pr-4 py-4 bg-netflix-darkGray border-2 border-netflix-lightGray text-white rounded-xl focus:outline-none focus:border-netflix-red transition-all text-lg"
              autoFocus
            />
          </div>

          {/* Results Count */}
          {debouncedSearchQuery && !loading && (
            <p className="text-gray-400 mt-4">
              {totalResults > 0 ? (
                <>
                  <span className="text-white font-semibold">{totalResults}</span> sonuç bulundu
                </>
              ) : (
                'Sonuç bulunamadı'
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Search Results */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && debouncedSearchQuery && movies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-500 mb-4">
              <FiSearch size={80} className="mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">
                Sonuç Bulunamadı
              </h2>
              <p className="text-gray-400">
                "<span className="text-white">{debouncedSearchQuery}</span>" için sonuç bulunamadı.
              </p>
              <p className="text-gray-400 mt-2">
                Farklı anahtar kelimeler deneyin.
              </p>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!debouncedSearchQuery && (
          <div className="text-center py-20">
            <div className="text-gray-500">
              <FiSearch size={80} className="mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">
                Film Aramaya Başlayın
              </h2>
              <p className="text-gray-400">
                Yukarıdaki arama kutusuna film adı yazın
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;