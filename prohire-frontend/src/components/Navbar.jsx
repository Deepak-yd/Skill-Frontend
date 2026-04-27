import { useMemo, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = useMemo(() => {
    if (!token) return [{ to: "/", label: "Home" }];
    
    const items = [
      { to: "/dashboard", label: "Dashboard" }
    ];
    
    if (user?.role === "admin") {
      items.push({ to: "/admin", label: "Admin Panel" });
    }
    
    if (user?.role === "user" || user?.role === "professional") {
      items.push({ to: "/connections", label: "Connections" });
    }
    
    items.push(
      { to: "/jobs", label: "Jobs" },
      { to: "/professionals", label: "Experts" },
      { to: "/messages", label: "Messages" },
      { to: "/hires", label: "Hires" },
      { to: "/profile", label: "Profile" },
      { to: "/settings", label: "Settings" },
      { to: "/support", label: "Support" }
    );
    
    return items;
  }, [token, user?.role]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 pointer-events-none ${scrolled ? "py-4 px-6" : "py-10 px-10"}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-6 pointer-events-auto">
        
        {/* 🌙 DUAL-MATRIX LOGO */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-5 focus:outline-none glass-panel p-3 border-white/10 hover:scale-105 transition-all shadow-2xl"
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic shadow-2xl transition-all ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-950'}`}>P</div>
          <div className="flex flex-col items-start pr-4">
             <h1 className="text-xl font-black tracking-tight leading-none italic uppercase">ProHire</h1>
             <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-1 leading-none italic">Foundry Platform</span>
          </div>
        </button>

        {/* 🌙 DUAL-MATRIX CAPSULE NAV */}
        <div className="flex items-center glass-panel border-white/5 bg-white/5 backdrop-blur-3xl px-3 py-2 rounded-full shadow-2xl border-[2px]">
          <div className="flex items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative px-5 py-3 text-[9px] font-black uppercase tracking-[0.3em] font-mono italic transition-all duration-500 rounded-full leading-none ${
                    isActive
                      ? "text-white bg-indigo-600 shadow-xl"
                      : "text-slate-400 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          
          <div className="w-[1px] h-6 bg-white/10 mx-4"></div>

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE (Futuristic Switch) */}
            <button
               onClick={toggleTheme}
               className="w-10 h-10 glass-panel border-white/10 flex items-center justify-center text-lg hover:scale-110 active:scale-95 transition-all shadow-xl bg-white/5 rounded-full"
            >
               {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {!token ? (
              <button
                onClick={() => navigate("/register")}
                className="btn-glow px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic"
              >
                Onboard
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black text-xs text-white shadow-xl hover:scale-110 active:scale-95 transition-all border border-white"
                >
                  {user?.name?.[0]?.toUpperCase()}
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-8 w-72 glass-panel border-white/5 p-8 z-[200] animate-reveal shadow-2xl rounded-[2.5rem] border-[2px]">
                    <div className="mb-6 border-b border-white/5 pb-6">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 leading-none italic">Neural Peer Verified</p>
                       <p className="text-lg font-black tracking-tight uppercase leading-none italic truncate">{user?.name}</p>
                       <p className="text-[10px] text-indigo-500 font-black font-mono tracking-widest mt-2 truncate opacity-60">{user?.email}</p>
                    </div>
                    <div>
                       <button onClick={handleLogout} className="w-full text-center py-4 text-[10px] text-pink-600 font-black uppercase tracking-[0.4em] hover:bg-pink-600/10 rounded-xl transition border border-pink-500/20 italic">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </nav>
    </div>
  );
}

export default Navbar;
