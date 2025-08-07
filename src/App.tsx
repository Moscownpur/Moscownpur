import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import Layout from './components/Layout';
import { useSEO } from './hooks/useSEO';
import StructuredData from './components/StructuredData';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorldManagement = lazy(() => import('./pages/WorldManagement'));
const RegionManagement = lazy(() => import('./pages/RegionManagement'));
const CharacterManagement = lazy(() => import('./pages/CharacterManagement'));
const TimelineEvents = lazy(() => import('./pages/TimelineEvents'));
const StoryScenes = lazy(() => import('./pages/StoryScenes'));
const WorldDetails = lazy(() => import('./pages/WorldDetails'));
const SceneManagement = lazy(() => import('./pages/SceneManagement'));
const SceneDetail = lazy(() => import('./pages/SceneDetail'));
const ChapterManagement = lazy(() => import('./pages/ChapterManagement'));
const AITest = lazy(() => import('./components/AITest'));
const AIIntegration = lazy(() => import('./pages/AIIntegration'));

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
              <Suspense fallback={<LoadingSpinner />}>
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
                    <Route path="ai-integration/:worldId" element={<AIIntegration />} />
                  </Route>
                </Routes>
              </Suspense>
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