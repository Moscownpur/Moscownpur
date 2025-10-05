import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { useSEO } from './hooks/useSEO';
import StructuredData from './components/StructuredData';
import LoadingSpinner from './components/LoadingSpinner';
import { initializeAllOptimizations } from './utils/performance';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/public_pages/Landing'));
const Features = lazy(() => import('./pages/public_pages/Features'));
const WorldBuildingGuide = lazy(() => import('./pages/public_pages/WorldBuildingGuide'));
const Pricing = lazy(() => import('./pages/public_pages/Pricing'));
const Blog = lazy(() => import('./pages/public_pages/Blog'));
const BlogPostPage = lazy(() => import('./pages/public_pages/BlogPostPage'));
const About = lazy(() => import('./pages/public_pages/About'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Dashboard = lazy(() => import('./pages/authenticated_pages/Dashboard'));
const WorldManagement = lazy(() => import('./pages/authenticated_pages/WorldManagement'));
const CharacterManagement = lazy(() => import('./pages/authenticated_pages/CharacterManagement'));
const EventManagement = lazy(() => import('./pages/authenticated_pages/EventManagement'));
const TimelineEvents = lazy(() => import('./pages/authenticated_pages/TimelineEvents'));
const StoryScenes = lazy(() => import('./pages/authenticated_pages/StoryScenes'));
const WorldDetails = lazy(() => import('./pages/authenticated_pages/WorldDetails'));
const SceneManagement = lazy(() => import('./pages/authenticated_pages/SceneManagement'));
const SceneDetail = lazy(() => import('./pages/authenticated_pages/SceneDetail'));
const ChapterManagement = lazy(() => import('./pages/authenticated_pages/ChapterManagement'));
const AITest = lazy(() => import('./components/AITest'));
const AIIntegration = lazy(() => import('./pages/authenticated_pages/AIIntegration'));
const SupabaseTest = lazy(() => import('./pages/public_pages/SupabaseTest'));
const PerformanceDashboard = lazy(() => import('./pages/public_pages/PerformanceDashboard'));
const DialogueDemo = lazy(() => import('./pages/authenticated_pages/DialogueDemo'));
const DialogueManagement = lazy(() => import('./pages/authenticated_pages/DialogueManagement'));
const MoscowvitzWiki = lazy(() => import('./pages/public_pages/MoscowvitzWiki'));
const ProfilePage = lazy(() => import('./pages/public_pages/ProfilePage'));
const ShadCNTest = lazy(() => import('./pages/public_pages/ShadCNTest'));
const NotFound = lazy(() => import('./pages/public_pages/NotFound'));

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
  // Initialize performance optimizations
  useEffect(() => {
    initializeAllOptimizations();
  }, []);

  return (
    <HelmetProvider>
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
                    <Route path="/features" element={<Features />} />
                    <Route path="/world-building-guide" element={<WorldBuildingGuide />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/supabase-test" element={<SupabaseTest />} />
                    <Route path="/performance" element={<PerformanceDashboard />} />
                    <Route path="/dialogue-demo" element={<DialogueDemo />} />
                    <Route path="/wiki/moscowvitz" element={<MoscowvitzWiki />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
                    <Route path="/shadcn-test" element={<ShadCNTest />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route 
                      path="/admin/dashboard" 
                      element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="worlds" element={<WorldManagement />} />
                      <Route path="worlds/:id" element={<WorldDetails />} />
                      <Route path="chapters" element={<ChapterManagement />} />
                      <Route path="characters" element={<CharacterManagement />} />
                      <Route path="events" element={<EventManagement />} />
                      <Route path="scenes" element={<SceneManagement />} />
                      <Route path="scenes/:id" element={<SceneDetail />} />
                      <Route path="dialogues" element={<DialogueManagement />} />
                      <Route path="timeline" element={<TimelineEvents />} />
                      <Route path="stories" element={<StoryScenes />} />
                      <Route path="ai-test" element={<AITest />} />
                      <Route path="ai-integration/:worldId" element={<AIIntegration />} />
                    </Route>
                    {/* Catch-all route for 404 pages */}
                    <Route path="*" element={<NotFound />} />
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
            <Analytics />
            <SpeedInsights />
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
