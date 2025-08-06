import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-white/20 border-t-white/80 mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 