import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/Dashboard';
import WorldManagement from './pages/WorldManagement';
import RegionManagement from './pages/RegionManagement';
import CharacterManagement from './pages/CharacterManagement';
import TimelineEvents from './pages/TimelineEvents';
import StoryScenes from './pages/StoryScenes';
import WorldDetails from './pages/WorldDetails';
import SceneManagement from './pages/SceneManagement';
import SceneDetail from './pages/SceneDetail';
import ChapterManagement from './pages/ChapterManagement';
import AITest from './components/AITest';
import { useSEO } from './hooks/useSEO';
import StructuredData from './components/StructuredData';

// Component to handle SEO updates
const SEOUpdater: React.FC = () => {
  useSEO();
  return null;
};

// Component to handle structured data
const StructuredDataUpdater: React.FC = () => {
  return <StructuredData type="WebApplication" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <SEOUpdater />
            <StructuredDataUpdater />
            <div className="min-h-screen bg-black">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="worlds" element={<WorldManagement />} />
                  <Route path="worlds/:id" element={<WorldDetails />} />
                  <Route path="regions" element={<RegionManagement />} />
                  <Route path="characters" element={<CharacterManagement />} />
                  <Route path="timeline" element={<TimelineEvents />} />
                  <Route path="chapters" element={<ChapterManagement />} />
                  <Route path="scenes" element={<SceneManagement />} />
                  <Route path="scenes/:id" element={<SceneDetail />} />
                  <Route path="stories" element={<StoryScenes />} />
                  <Route path="ai-test" element={<AITest />} />
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
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;