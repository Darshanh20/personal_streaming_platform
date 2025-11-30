import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { PlayerProvider } from './context/PlayerContext'
import MusicPlayer from './components/MusicPlayer'
import Landing from './pages/Landing'
import SongsPage from './pages/SongsPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 pb-24">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/songs" element={<SongsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <MusicPlayer />
      </Router>
    </PlayerProvider>
  )
}

export default App
