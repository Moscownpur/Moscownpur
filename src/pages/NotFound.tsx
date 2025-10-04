import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 dark">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-all duration-300 border border-border"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-muted-foreground text-sm mb-4">Or try one of these popular pages:</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/features"
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors duration-200 text-sm"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors duration-200 text-sm"
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors duration-200 text-sm"
            >
              Blog
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors duration-200 text-sm"
            >
              About
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <Search className="w-4 h-4 mr-2" />
            Can't find what you're looking for?
          </div>
          <p className="text-muted-foreground text-xs">
            Try using the search function or contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
