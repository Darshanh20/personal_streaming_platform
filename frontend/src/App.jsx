import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import SongsPage from './pages/SongsPage'
import AdminUploadPage from './pages/AdminUploadPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/songs" element={<SongsPage />} />
          
          {/* Secret Admin Routes - No UI links, manually visit the URL */}
          <Route path="/admin" element={<AdminUploadPage />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
