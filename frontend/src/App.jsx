import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import { PlayerProvider } from './context/PlayerContext'
import MusicPlayer from '@components/MusicPlayer'
import Landing from '@pages/Landing'
import SongsPage from '@pages/SongsPage'
import AdminPage from '@pages/AdminPage'

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <>
      <div className={`min-h-screen bg-gray-900 ${!isAdminPage ? 'pb-24' : ''}`}>
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
      {/* Music player always rendered to persist audio across page navigation */}
      <div className={isAdminPage ? 'hidden' : ''}>
        <MusicPlayer />
      </div>
    </>
  );
}

function App() {
  return (
    <PlayerProvider>
      <Router>
        <AppContent />
      </Router>
    </PlayerProvider>
  )
}

export default App
