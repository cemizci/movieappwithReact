import React from 'react'
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { movieApi } from '../services/tmdbApi';

const Home = () => {
  return (
    <>
    <div className='min-h-screen bg-black '>
      {/* Hero Section */}
      <Hero/>
    </div>
     
     <div>
       {/* Movie Rows */}
      <div className='relative z-10 bg-black mt-15'>
        <MovieRow 
          title="Trend Filmler"
          fetchFunction={movieApi.getTrending}
        />

        <MovieRow 
          title="Şimdi Vizyonda" 
          fetchFunction={movieApi.getNowPlaying} 
        />

        <MovieRow 
          title="Popüler Filmler" 
          fetchFunction={movieApi.getPopular} 
        />

        <MovieRow 
          title="En Yüksek Puanlılar" 
          fetchFunction={movieApi.getTopRated} 
        />

        <MovieRow 
          title="Yakında" 
          fetchFunction={movieApi.getUpcoming} 
        />
      </div>
     </div>
    
    </>
    
  )
}

export default Home