import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import WorldManagement from './pages/WorldManagement';
import RegionManagement from './pages/RegionManagement';
import CharacterManagement from './pages/CharacterManagement';
import TimelineEvents from './pages/TimelineEvents';
import StoryScenes from './pages/StoryScenes';
import WorldDetails from './pages/WorldDetails';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="worlds" element={<WorldManagement />} />
                <Route path="worlds/:id" element={<WorldDetails />} />
                <Route path="regions" element={<RegionManagement />} />
                <Route path="characters" element={<CharacterManagement />} />
                <Route path="timeline" element={<TimelineEvents />} />
                <Route path="stories" element={<StoryScenes />} />
              </Route>
            </Routes>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;