import React, { useEffect, useState } from 'react';
import logoImage from '/logo.jpg';

interface LoadingSpinnerProps {
  message?: string;
  showProgress?: boolean;
  onComplete?: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading MosCownpur...", 
  showProgress = true,
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the initial loading screen from index.html
    const initialLoadingScreen = document.getElementById('loading-screen');
    if (initialLoadingScreen) {
      initialLoadingScreen.style.display = 'none';
    }

    // Hide pre-rendered content
    const prerenderedContent = document.getElementById('prerendered-content');
    if (prerenderedContent) {
      prerenderedContent.style.display = 'none';
    }

    // Simulate loading progress
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsVisible(false);
              onComplete?.();
            }, 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // For non-progress loading, just hide after a delay
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showProgress, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="loading-container">
      <img src={logoImage} alt="MosCownpur Logo" className="loading-logo" />
      <h2 className="loading-title">MosCownpur</h2>
      <p className="loading-subtitle">Empowering creators to build infinite worlds</p>
      
      {showProgress ? (
        <>
          <div className="loading-spinner"></div>
          <div className="loading-progress">
            <div 
              className="loading-progress-bar" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-white/60 text-sm mt-4">{message}</p>
        </>
      ) : (
        <div className="loading-spinner"></div>
      )}
    </div>
  );
};

export default LoadingSpinner; 