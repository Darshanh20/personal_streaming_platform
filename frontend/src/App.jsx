import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import SongsPage from './pages/SongsPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
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
    </Router>
  )
}

export default App

