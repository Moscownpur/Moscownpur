import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Gauge,
  Smartphone,
  Monitor,
  Globe,
  Database,
  FileText,
  Image as ImageIcon,
  Code,
  Settings
} from 'lucide-react';
import { monitorCoreWebVitals } from '../utils/performance';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  domLoad: number;
  windowLoad: number;
  resourceCount: number;
  totalSize: number;
  cacheHitRate: number;
}

interface ResourceMetric {
  name: string;
  type: 'script' | 'style' | 'image' | 'font' | 'other';
  size: number;
  loadTime: number;
  status: 'good' | 'warning' | 'poor';
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    domLoad: 0,
    windowLoad: 0,
    resourceCount: 0,
    totalSize: 0,
    cacheHitRate: 0
  });

  const [resources, setResources] = useState<ResourceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const measurePerformance = () => {
      // Get real performance metrics
      const realMetrics = monitorCoreWebVitals();
      
      // Get additional performance data from Navigation Timing API
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Calculate real metrics
      const newMetrics: PerformanceMetrics = {
        fcp: realMetrics.firstContentfulPaint || 0,
        lcp: realMetrics.largestContentfulPaint || 0,
        fid: realMetrics.firstInputDelay || 0,
        cls: realMetrics.cumulativeLayoutShift || 0,
        ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
        domLoad: navigation ? navigation.domContentLoadedEventEnd - navigation.navigationStart : 0,
        windowLoad: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
        resourceCount: resources.length,
        totalSize: resources.reduce((total, resource) => total + (resource.transferSize || 0), 0) / 1024, // Convert to KB
        cacheHitRate: resources.length > 0 ? 
          (resources.filter(r => r.transferSize === 0).length / resources.length) * 100 : 0
      };

      setMetrics(newMetrics);
      setLastUpdated(new Date());
      setIsLoading(false);
    };

    // Wait for page to load before measuring
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Update every 30 seconds
    const interval = setInterval(measurePerformance, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  useEffect(() => {
    // Get real resource metrics from Performance API
    const getResourceMetrics = () => {
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const newResources: ResourceMetric[] = resourceEntries.map(entry => {
        // Extract filename from URL
        const url = new URL(entry.name);
        const name = url.pathname.split('/').pop() || entry.name;
        
        // Determine resource type based on URL or initiatorType
        let type: 'script' | 'style' | 'image' | 'font' | 'other' = 'other';
        if (name.endsWith('.js') || entry.initiatorType === 'script') type = 'script';
        else if (name.endsWith('.css') || entry.initiatorType === 'link') type = 'style';
        else if (name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) || entry.initiatorType === 'img') type = 'image';
        else if (name.match(/\.(woff|woff2|ttf|otf)$/i) || entry.initiatorType === 'css') type = 'font';
        
        const size = (entry.transferSize || 0) / 1024; // Convert to KB
        const loadTime = entry.responseEnd - entry.requestStart;
        
        let status: 'good' | 'warning' | 'poor' = 'good';
        if (loadTime > 800) status = 'poor';
        else if (loadTime > 400) status = 'warning';

        return { name, type, size, loadTime, status };
      });

      // Sort by load time (slowest first)
      newResources.sort((a, b) => b.loadTime - a.loadTime);
      
      setResources(newResources);
    };

    // Get resource metrics after page load
    if (document.readyState === 'complete') {
      getResourceMetrics();
    } else {
      window.addEventListener('load', getResourceMetrics);
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (score >= 50) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <AlertTriangle className="w-5 h-5 text-red-400" />;
  };

  const calculatePerformanceScore = () => {
    const scores = [
      metrics.fcp < 1800 ? 100 : Math.max(0, 100 - (metrics.fcp - 1800) / 10),
      metrics.lcp < 2500 ? 100 : Math.max(0, 100 - (metrics.lcp - 2500) / 20),
      metrics.fid < 100 ? 100 : Math.max(0, 100 - (metrics.fid - 100) / 2),
      metrics.cls < 0.1 ? 100 : Math.max(0, 100 - metrics.cls * 1000)
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const performanceScore = calculatePerformanceScore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Performance Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold gradient-text-cosmic mb-2">
            Performance Optimization Dashboard
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-400">
            Real-time monitoring of MosCownpur's performance metrics using actual browser performance data
          </motion.p>
          <motion.div variants={itemVariants} className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real performance data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Core Web Vitals monitoring</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Overall Performance Score */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Overall Performance Score</h2>
              <p className="text-gray-400">Based on Core Web Vitals and loading metrics</p>
            </div>
            {getScoreIcon(performanceScore)}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - performanceScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                  {performanceScore}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">First Contentful Paint</p>
                  <p className={`text-lg font-semibold ${metrics.fcp < 1800 ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics.fcp.toFixed(0)}ms
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Largest Contentful Paint</p>
                  <p className={`text-lg font-semibold ${metrics.lcp < 2500 ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics.lcp.toFixed(0)}ms
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">First Input Delay</p>
                  <p className={`text-lg font-semibold ${metrics.fid < 100 ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics.fid.toFixed(0)}ms
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cumulative Layout Shift</p>
                  <p className={`text-lg font-semibold ${metrics.cls < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics.cls.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Web Vitals Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-orange-400" />
              <h3 className="font-semibold">First Contentful Paint</h3>
            </div>
            <p className={`text-3xl font-bold mb-2 ${metrics.fcp < 1800 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.fcp.toFixed(0)}ms
            </p>
            <p className="text-sm text-gray-400">
              {metrics.fcp < 1800 ? 'Good' : metrics.fcp < 3000 ? 'Needs Improvement' : 'Poor'}
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold">Largest Contentful Paint</h3>
            </div>
            <p className={`text-3xl font-bold mb-2 ${metrics.lcp < 2500 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.lcp.toFixed(0)}ms
            </p>
            <p className="text-sm text-gray-400">
              {metrics.lcp < 2500 ? 'Good' : metrics.lcp < 4000 ? 'Needs Improvement' : 'Poor'}
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="w-6 h-6 text-purple-400" />
              <h3 className="font-semibold">First Input Delay</h3>
            </div>
            <p className={`text-3xl font-bold mb-2 ${metrics.fid < 100 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.fid.toFixed(0)}ms
            </p>
            <p className="text-sm text-gray-400">
              {metrics.fid < 100 ? 'Good' : metrics.fid < 300 ? 'Needs Improvement' : 'Poor'}
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold">Cumulative Layout Shift</h3>
            </div>
            <p className={`text-3xl font-bold mb-2 ${metrics.cls < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.cls.toFixed(3)}
            </p>
            <p className="text-sm text-gray-400">
              {metrics.cls < 0.1 ? 'Good' : metrics.cls < 0.25 ? 'Needs Improvement' : 'Poor'}
            </p>
          </div>
        </motion.div>

        {/* Loading Metrics */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-400" />
              Loading Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Time to First Byte</span>
                <span className="font-semibold">{metrics.ttfb.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">DOM Load Time</span>
                <span className="font-semibold">{metrics.domLoad.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Window Load Time</span>
                <span className="font-semibold">{metrics.windowLoad.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Resource Count</span>
                <span className="font-semibold">{metrics.resourceCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Size</span>
                <span className="font-semibold">{(metrics.totalSize / 1024).toFixed(1)}MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cache Hit Rate</span>
                <span className="font-semibold">{metrics.cacheHitRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Resource Analysis
            </h3>
            <div className="space-y-4">
              {resources.slice(0, 6).map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {resource.type === 'script' && <Code className="w-4 h-4 text-blue-400" />}
                    {resource.type === 'style' && <FileText className="w-4 h-4 text-purple-400" />}
                    {resource.type === 'image' && <ImageIcon className="w-4 h-4 text-green-400" />}
                    {resource.type === 'font' && <Database className="w-4 h-4 text-orange-400" />}
                    {resource.type === 'other' && <Settings className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm font-medium">{resource.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      resource.status === 'good' ? 'text-green-400' : 
                      resource.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {resource.loadTime.toFixed(0)}ms
                    </div>
                    <div className="text-xs text-gray-400">
                      {(resource.size / 1024).toFixed(1)}KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Optimization Recommendations */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-orange-400" />
            Optimization Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-400">Optimized</h4>
                  <p className="text-sm text-gray-400">Resource hints and preloading configured</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-400">Optimized</h4>
                  <p className="text-sm text-gray-400">Image compression and lazy loading enabled</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-400">Optimized</h4>
                  <p className="text-sm text-gray-400">CSS and JavaScript minification active</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-400">Consider</h4>
                  <p className="text-sm text-gray-400">Implement HTTP/2 server push for critical resources</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-400">Consider</h4>
                  <p className="text-sm text-gray-400">Add service worker for offline caching</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-400">Consider</h4>
                  <p className="text-sm text-gray-400">Implement critical CSS inlining</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
