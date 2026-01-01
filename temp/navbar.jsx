import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "../../pages/ThemeSwitcher.jsx";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import Logout from "../Auth/Logout.jsx";
import SearchBar from "../Search/SearchBar.jsx";
import MoscownpurLogo from "../ui/MoscownpurLogo.jsx";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const NavBar = () => {
  const { primaryColor } = useTheme();
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

  const isActive = (path) => location.pathname === path;

  // Premium Link Styles
  const linkClasses = (path) => `
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
            ? "top-4 w-[90%] md:w-[80%] max-w-5xl rounded-full bg-black/80 backdrop-blur-xl shadow-[0_0_30px_-5px_var(--primary-color)]"
            : "top-0 w-full max-w-[100vw] bg-transparent border-b border-transparent py-2"
          }
        `}
      >
        {/* Glowing Gradient Border */}
        {scrolled && (
          <div className="absolute inset-0 rounded-full p-[1px] -z-10 bg-gradient-to-r from-white/20 via-[var(--primary-color)] to-white/20">
            <div className="w-full h-full bg-black/90 rounded-full backdrop-blur-xl"></div>
          </div>
        )}

        <div className={`px-6 ${scrolled ? "py-3" : "py-4"} flex justify-between items-center transition-all duration-500 relative`}>

          {/* --- BRAND --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`relative flex items-center justify-center ${scrolled ? "w-8 h-8" : "w-10 h-10"} transition-all duration-500`}>
              {/* Logo Glow */}
              <div className="absolute inset-0 bg-[var(--primary-color)] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
              <MoscownpurLogo className={`w-full h-full text-[var(--primary-color)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180`} />
            </div>
            <span className={`font-bungee tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--primary-color)] to-white transition-all duration-500 ${scrolled ? "text-xl" : "text-2xl"}`}>
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
                <div className={`transition-all duration-500 ${scrolled ? "w-32 lg:w-48" : "w-32 lg:w-48"} max-w-[150px] lg:max-w-48`}>
                  <SearchBar />
                </div>
                <ThemeSwitcher />
                <Logout />
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
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-[var(--primary-color)] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ mixBlendMode: 'soft-light' }}></div>
                  </button>
                </Link>
                <ThemeSwitcher />
              </div>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center gap-4">
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
          <Link to="/" className="text-lg font-medium text-gray-300 hover:text-[var(--primary-color)]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/feed" className="text-lg font-medium text-gray-300 hover:text-[var(--primary-color)]" onClick={() => setIsMobileMenuOpen(false)}>Feed</Link>
          <Link to="/health" className="text-lg font-medium text-gray-300 hover:text-[var(--primary-color)]" onClick={() => setIsMobileMenuOpen(false)}>Health</Link>
          

          {user ? (
            <>
              <Link to="/chat" className="text-lg font-medium text-gray-300 hover:text-[var(--primary-color)]" onClick={() => setIsMobileMenuOpen(false)}>Chat</Link>
              <Link to="/profile" className="text-lg font-medium text-gray-300 hover:text-[var(--primary-color)]" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <Link to="/circles" className="text-lg font-medium text-gray-300 hover:text-[var(--primary-color)]" onClick={() => setIsMobileMenuOpen(false)}>Circles</Link>
              <SearchBar />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="text-gray-400 text-sm">Theme</span>
                <div className="flex items-center gap-4">
                  <ThemeSwitcher />
                  <Logout />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Link to="/login" className="flex justify-center items-center py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="flex justify-center items-center py-3 bg-white rounded-xl text-black font-bold hover:bg-[var(--primary-color)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>

      </nav>
    </>
  );
};

export default NavBar;
