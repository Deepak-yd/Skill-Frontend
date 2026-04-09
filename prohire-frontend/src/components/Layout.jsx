import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const footerLinks = {
    Platform: [
      { label: "Find Professionals", path: "/professionals" },
      { label: "Post a Project", path: "/jobs" },
      { label: "Browse Categories", path: "/professionals" },
    ],
    Company: [
      { label: "About Us", path: "/" },
      { label: "Blog", path: "/" },
      { label: "Careers", path: "/" },
    ],
    Support: [
      { label: "Help Center", path: "/" },
      { label: "Contact Us", path: "/" },
      { label: "FAQ", path: "/" },
    ],
    Legal: [
      { label: "Privacy Policy", path: "/" },
      { label: "Terms of Service", path: "/" },
      { label: "Cookie Policy", path: "/" },
    ],
  };

  const neuralPath = location.pathname.split('/').filter(Boolean);

  return (
    <div className={`flex flex-col min-h-screen selection:bg-indigo-500/20 overflow-x-hidden relative transition-colors duration-1000 ${theme}`}>
      <div className="mesh-bg"></div>
      
      {/* 🌙 DUAL-MATRIX NEURAL BLOBS (Synced to Theme) */}
      <div className={`neural-blob w-[600px] h-[600px] top-[-10%] left-[-10%] ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>
      <div className={`neural-blob w-[500px] h-[500px] bottom-[10%] right-[-10%] animate-pulse ${theme === 'dark' ? 'bg-purple-600' : 'bg-teal-400'}`} style={{ animationDelay: '-5s' }}></div>
      <div className={`neural-blob w-[400px] h-[400px] top-[30%] left-[20%] ${theme === 'dark' ? 'bg-pink-600' : 'bg-amber-400'}`} style={{ animationDelay: '-10s' }}></div>

      <Navbar />

      <main className="flex-1 relative z-10 pt-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16 pb-32">
          
          {/* DUAL-MATRIX BREADCRUMBS */}
          {location.pathname !== '/' && (
            <div className="flex items-center gap-4 animate-reveal opacity-0">
               <button onClick={() => navigate('/')} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-indigo-500 transition-all font-mono leading-none italic">ROOT</button>
               {neuralPath.map((path, idx) => (
                 <div key={idx} className="flex items-center gap-4">
                    <span className="text-slate-500 opacity-20 font-thin italic">/</span>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] font-mono leading-none italic">{path}</span>
                 </div>
               ))}
               <div className="ml-auto w-12 h-0.5 bg-slate-500/10 rounded-full"></div>
            </div>
          )}

          <div className="animate-reveal" key={location.pathname}>
            {children}
          </div>
        </div>
      </main>

      <footer className="relative mt-40 overflow-hidden bg-white/5 backdrop-blur-3xl border-t border-white/5 pb-20 pt-32">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
            
            <div className="lg:col-span-5 space-y-12">
               <div onClick={() => navigate("/")} className="flex flex-col gap-2 cursor-pointer group w-fit">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl group-hover:scale-110 transition-transform italic">P</div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">ProHire</h3>
                  </div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] pl-16 italic opacity-60">Foundry Platform V2.5</p>
               </div>
               <p className="text-slate-400 font-medium leading-relaxed max-w-sm text-lg italic opacity-80">
                  Global infrastructure for high-fidelity professional nodes. Deploy elite engineering sequences through secure neural links.
               </p>
               <div className="flex gap-4">
                 {['LNK', 'X.CORP', 'DRB', 'GTH'].map(soc => (
                    <button key={soc} className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 hover:bg-white hover:text-slate-950 transition-all font-mono italic">{soc}</button>
                 ))}
               </div>
            </div>

            <div className="lg:col-span-7">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                  {Object.entries(footerLinks).map(([cat, links]) => (
                    <div key={cat}>
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10 leading-none italic opacity-40">{cat}</h4>
                       <ul className="space-y-6">
                          {links.map((l, i) => (
                             <li key={i}>
                                <button onClick={() => navigate(l.path)} className="text-[11px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] italic font-mono">{l.label}</button>
                             </li>
                          ))}
                       </ul>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex flex-col md:flex-row items-center gap-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono leading-none italic opacity-40">© 2026 ProHire Global Foundry Protocol</p>
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-2xl"></div>
                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em] font-mono leading-none italic">Sector_Stable_Verified</span>
                </div>
             </div>
             <div className="flex gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono opacity-40">
                {['Terms', 'Privacy', 'Security'].map(t => <button key={t} className="hover:text-white transition-all italic">{t}</button>)}
             </div>
          </div>
        </div>
      </footer>

      {/* DUAL-MATRIX SCROLL TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-12 right-12 w-14 h-14 glass-panel border-white/5 bg-white/5 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group hover:bg-white hover:text-slate-950 transition-all hover:scale-110 active:scale-95"
      >
        <span className="text-xl group-hover:-translate-y-1 transition-transform">↑</span>
      </button>

    </div>
  );
}

export default Layout;
