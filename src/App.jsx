import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import TranscriptForm from './pages/TranscriptForm'
import PastTranscripts from './pages/PastTranscripts'
import Students from './pages/Students'
import Dashboard from './components/Dashboard'
import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'
import TranscriptProvider from './context/TranscriptContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <TranscriptProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create" 
                  element={
                    <ProtectedRoute>
                      <TranscriptForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/past-transcripts" 
                  element={
                    <ProtectedRoute>
                      <PastTranscripts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/students" 
                  element={
                    <ProtectedRoute>
                      <Students />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TranscriptProvider>
    </AuthProvider>
  )
}

export default App