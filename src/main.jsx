import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext'

createRoot(document.getElementById('root')).render(
  <>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </>,
)
