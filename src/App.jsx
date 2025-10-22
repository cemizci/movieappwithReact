import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail"
import Search from "./pages/Search";
import Favorites from "./pages/Favorites"


function App() {
  

  return (
    <Router>

      <div className='min-h-screen bg-netflix-black'>
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/movie/:id' element={<MovieDetail/>} />
        <Route path='/search' element={<Search/>}/>
        <Route path='/favorites' element={<Favorites/>} />
      </Routes>

      <Footer/>
      </div>
    </Router>
  )
}

export default App
