import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for dynamic styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Premium Link Styles
  const linkClasses = (path: string) => `
    relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
    ${isActive(path)
      ? "text-black bg-white"  // Active state: Pill shape
      : "text-gray-400 hover:text-white hover:bg-white/10" // Inactive: Ghost hover
    }
  `;

  return (
    <>
      {/* 
       Floating Navbar Container 
       - Adjusts width and top position based on scroll state for a dynamic feel 
      */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out box-border
            ${scrolled
            ? "top-4 w-[90%] md:w-[80%] max-w-5xl rounded-full bg-black/80 backdrop-blur-xl shadow-[0_0_30px_-5px_#8b5cf6]"
            : "top-0 w-full max-w-[100vw] bg-transparent border-b border-transparent py-2"
          }
        `}
      >
        {/* Glowing Gradient Border */}
        {scrolled && (
          <div className="absolute inset-0 rounded-full p-[1px] -z-10 bg-gradient-to-r from-white/20 via-purple-500 to-white/20">
            <div className="w-full h-full bg-black/90 rounded-full backdrop-blur-xl"></div>
          </div>
        )}

        <div className={`px-6 ${scrolled ? "py-3" : "py-4"} flex justify-between items-center transition-all duration-500 relative`}>

          {/* --- BRAND --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`relative flex items-center justify-center ${scrolled ? "w-8 h-8" : "w-10 h-10"} transition-all duration-500`}>
              {/* Logo Glow */}
              <div className="absolute inset-0 bg-purple-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
              <div className={`w-full h-full text-purple-500 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 flex items-center justify-center font-bold text-white`}>
                M
              </div>
            </div>
            <span className={`font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-500 to-white transition-all duration-500 ${scrolled ? "text-xl" : "text-2xl"}`}>
              Moscownpur Circles
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION (Centered) --- */}
          <div className="hidden md:flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/5 backdrop-blur-md">
            <Link to="/" className={linkClasses("/")}>Home</Link>
            <Link to="/feed" className={linkClasses("/feed")}>Feed</Link>
            <Link to="/health" className={linkClasses("/health")}>Health</Link>
            
            {user && (
              <>
                <Link to="/chat" className={linkClasses("/chat")}>Chat</Link>
                <Link to="/profile" className={linkClasses("/profile")}>Profile</Link>
                <Link to="/circles" className={linkClasses("/circles")}>Circles</Link>
              </>
            )}
          </div>

          {/* --- ACTIONS --- */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <ThemeSwitcher />
                <DarkModeToggle />
                <Link to="/logout" className="p-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                  <X size={18} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</Link>
                <Link to="/signup">
                  <button
                    className="group relative px-5 py-2 rounded-full overflow-hidden bg-white text-black font-bold text-sm transition-transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
                      Sign Up <ArrowRight className="w-4 h-4" />
                    </span>
                    {/* Gradient Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-purple-500 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ mixBlendMode: 'soft-light' }}></div>
                  </button>
                </Link>
                <ThemeSwitcher />
                <DarkModeToggle />
              </div>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <DarkModeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <div className={`
          md:hidden fixed inset-x-4 top-24 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl origin-top transition-all duration-300 ease-out
          ${isMobileMenuOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-4 pointer-events-none"}
      `}>
          <Link to="/" className="text-lg font-medium text-gray-300 hover:text-purple-500" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/feed" className="text-lg font-medium text-gray-300 hover:text-purple-500" onClick={() => setIsMobileMenuOpen(false)}>Feed</Link>
          <Link to="/health" className="text-lg font-medium text-gray-300 hover:text-purple-500" onClick={() => setIsMobileMenuOpen(false)}>Health</Link>
          

          {user ? (
            <>
              <Link to="/chat" className="text-lg font-medium text-gray-300 hover:text-purple-500" onClick={() => setIsMobileMenuOpen(false)}>Chat</Link>
              <Link to="/profile" className="text-lg font-medium text-gray-300 hover:text-purple-500" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <Link to="/circles" className="text-lg font-medium text-gray-300 hover:text-purple-500" onClick={() => setIsMobileMenuOpen(false)}>Circles</Link>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="text-gray-400 text-sm">Theme</span>
                <div className="flex items-center gap-4">
                  <ThemeSwitcher />
                  <DarkModeToggle />
                  <Link to="/logout" className="p-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                    <X size={18} />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Link to="/login" className="flex justify-center items-center py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="flex justify-center items-center py-3 bg-white rounded-xl text-black font-bold hover:bg-purple-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>

      </nav>
    </>
  );
};

export default Navbar;