import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/ThemeContext";

function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { theme } = useTheme();

  const categories = [
    { title: "Web Development", icon: "🌐", nodes: "1.2k", color: "text-indigo-500" },
    { title: "AI & Machine Learning", icon: "🤖", nodes: "850", color: "text-purple-500" },
    { title: "UI/UX Design", icon: "🎨", nodes: "600", color: "text-pink-500" },
    { title: "Cloud Engineering", icon: "☁️", nodes: "400", color: "text-teal-500" },
    { title: "Cyber Security", icon: "🛡️", nodes: "320", color: "text-emerald-500" },
    { title: "Data Analytics", icon: "📊", nodes: "540", color: "text-amber-500" },
  ];

  const recentHires = [
    { client: "Tech-X", pro: "Alex R.", amount: "$1,500", date: "2m ago" },
    { client: "Design-O", pro: "Maria S.", amount: "$800", date: "15m ago" },
    { client: "AI-Stream", pro: "Jack H.", amount: "$12,400", date: "1h ago" },
    { client: "Meta-Node", pro: "Sarah V.", amount: "$3,200", date: "3h ago" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-indigo-500/20 font-sans pb-32">
      
      {/* 🌙 "ORBITAL" ATMOSPHERE */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-5%] right-[-10%] w-[70%] h-[80%] bg-indigo-600/5 blur-[120px] animate-float opacity-40"></div>
         <div className="absolute bottom-[-10%] left-[-15%] w-[60%] h-[70%] bg-teal-500/5 blur-[120px] animate-float delay-1000 opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 lg:pt-40 space-y-40">
        
        {/* 🌙 HERO ORBITAL */}
        <div className="grid lg:grid-cols-12 gap-20 items-center">
           <div className="lg:col-span-12 xl:col-span-7 space-y-10 animate-reveal text-center xl:text-left">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 glass-panel border-white/10 bg-white/5 rounded-full shadow-2xl">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] italic leading-none">Marketplace_Synchronized_0X</span>
              </div>
              <h1 className="text-6xl sm:text-8xl font-black tracking-[-0.05em] leading-[0.85] uppercase italic selection:text-indigo-600">
                Hire Elite <br />
                <span className="text-gradient-premium shimmer-text">Experts</span> <br />
                Instantly.
              </h1>
              <p className="text-slate-500 text-lg sm:text-xl font-bold max-w-xl leading-relaxed uppercase tracking-tight italic opacity-50 mx-auto xl:mx-0">
                High-fidelity hiring grid. Post jobs and pay securely for top-tier work. 
              </p>
              <div className="flex flex-col sm:flex-row gap-5 items-center justify-center xl:justify-start pt-6">
                 <button onClick={() => navigate(token ? "/dashboard" : "/register")} className="btn-glow px-16 py-6 rounded-2xl shadow-xl active:scale-95 transition-all text-[10px] w-full sm:w-auto">Initialize Hiring</button>
                 <button onClick={() => navigate("/professionals")} className="px-12 py-5.5 glass-panel border-white/5 text-slate-500 hover:text-white active:scale-95 transition-all rounded-2xl text-[9px] font-black uppercase tracking-[0.5em] italic w-full sm:w-auto">Explore Matrix</button>
              </div>
           </div>
           <div className="lg:col-span-12 xl:col-span-5 hidden xl:block animate-reveal relative" style={{ animationDelay: '0.3s' }}>
              <div className="tactile-node p-10 bg-white/5 border-white/10 shadow-2xl rounded-[3rem] relative overflow-hidden group min-h-[450px] flex flex-col justify-center items-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-teal-500/10 opacity-30"></div>
                 <div className="relative w-56 h-56 border border-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-40 h-40 border border-white/5 rounded-full flex items-center justify-center">
                       <div className="w-24 h-24 bg-indigo-600 rounded-full shadow-[0_0_80px_rgba(99,102,241,0.5)] flex items-center justify-center text-white text-4xl font-black italic">PH</div>
                    </div>
                 </div>
                 <div className="mt-10 text-center relative z-10">
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.8em] italic leading-none mb-3">Sync_Status</p>
                    <p className="text-xl font-black italic uppercase tracking-tighter shimmer-text">Nodes Online: 12.4k</p>
                 </div>
              </div>
           </div>
        </div>

        {/* 🌙 NEW: RECENT ACTIVITY TICKER (Success Stream) */}
        <div className="animate-reveal" style={{ animationDelay: '0.5s' }}>
           <div className="flex items-center justify-between px-8 border-l-[3px] border-indigo-600 mb-10">
              <div className="space-y-1">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.8em] italic leading-none opacity-40">Foundry Stream</h3>
                 <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] leading-none italic">Verified Recent Hires</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentHires.map((hire, i) => (
                 <div key={i} className="glass-panel p-6 bg-white/5 border-white/5 shadow-xl rounded-2xl flex items-center justify-between group hover:border-emerald-500/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center text-indigo-500 font-black text-xs italic">PH</div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] italic leading-none opacity-40">{hire.client} → {hire.pro}</p>
                          <p className="text-sm font-black text-white italic truncate">{hire.amount}</p>
                       </div>
                    </div>
                    <span className="text-[8px] font-black text-emerald-500 uppercase italic opacity-40 group-hover:opacity-100 transition">{hire.date}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* 🌙 NEW: SKILL CATEGORIES BENTO */}
        <div className="animate-reveal" style={{ animationDelay: '0.7s' }}>
           <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-12 xl:col-span-4 tactile-node p-12 bg-white/5 border-white/5 rounded-[3rem] flex flex-col justify-between group min-h-[400px]">
                 <div className="space-y-8">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] italic leading-none border-b border-white/5 pb-6 opacity-30">Marketplace Taxonomy</h3>
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-[0.9] text-gradient-premium shimmer-text">Browse Specialized Skill Nodes.</h2>
                 </div>
                 <p className="text-slate-500 text-base font-bold uppercase tracking-tight italic opacity-40 max-w-xs leading-relaxed">Filter experts via specialized categories for surgical project precision.</p>
              </div>
              <div className="lg:col-span-12 xl:col-span-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {categories.map((cat, i) => (
                    <div key={i} className="glass-panel p-8 bg-white/5 border-white/10 shadow-2xl rounded-3xl hover:bg-white/10 group transition-all cursor-pointer min-h-[180px] flex flex-col justify-end">
                       <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition italic">{cat.icon}</div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none opacity-30">{cat.nodes} Active Nodes</p>
                          <h4 className={`text-xl font-black italic uppercase leading-none ${cat.color} truncate`}>{cat.title}</h4>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* 🌙 NEW: HOW IT WORKS (The Process) */}
        <div className="animate-reveal" style={{ animationDelay: '0.9s' }}>
           <div className="grid lg:grid-cols-4 gap-12">
              {[
                { step: "01", title: "Post Job", label: "Describe project requirements and set your budget." },
                { step: "02", title: "Browse Experts", label: "Filter experts via categories and verified ratings." },
                { step: "03", title: "Secure Hire", label: "Initialize connection link and establish milestone goals." },
                { step: "04", title: "Authorize Pay", label: "Instant secure payment relay upon work completion." },
              ].map((item, i) => (
                <div key={i} className="space-y-8 group relative">
                   <div className="flex items-center gap-6">
                      <span className="text-6xl font-black text-white/5 italic group-hover:text-indigo-600/20 transition-all">{item.step}</span>
                      <div className="w-full h-[1.5px] bg-white/5 group-hover:bg-indigo-500/20 transition-all"></div>
                   </div>
                   <div className="space-y-4 pr-12">
                      <h4 className="text-2xl font-black italic text-indigo-500 uppercase leading-none">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-tight italic opacity-40 leading-relaxed">{item.label}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* 🌙 CTA FOOTER (Final Conversion Hub) */}
        <div className="animate-reveal pb-20" style={{ animationDelay: '1.1s' }}>
           <div className="tactile-node p-20 bg-indigo-600 text-white shadow-[0_0_100px_rgba(99,102,241,0.3)] rounded-[4rem] text-center space-y-12 relative overflow-hidden group border-indigo-500">
              <div className="absolute top-0 right-0 p-24 text-[20rem] opacity-[0.05] grayscale italic pointer-events-none font-black uppercase leading-none group-hover:scale-110 transition-transform select-none">JOIN</div>
              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                 <h2 className="text-6xl sm:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">Ready to Deploy <br /> Your Next Hire?</h2>
                 <p className="text-indigo-200 text-xl font-bold uppercase tracking-tight italic opacity-80">Join the high-fidelity professional grid and start scaling your work infrastructure today.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10 pt-8">
                 <button onClick={() => navigate("/register")} className="px-20 py-8 bg-white text-indigo-600 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] italic shadow-2xl active:scale-95 transition-all">Register Protocol</button>
                 <button onClick={() => navigate("/login")} className="px-16 py-7 border border-white/20 text-white hover:bg-white hover:text-indigo-600 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] italic transition-all active:scale-95">Access Terminal</button>
              </div>
           </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full px-10 py-6 z-[50] flex justify-between items-center pointer-events-none opacity-20 hover:opacity-100 transition-opacity duration-1000 font-mono italic">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] leading-none text-indigo-500">Global_Foundry_v2.7_Online</p>
         <p className="text-[9px] font-black uppercase tracking-[0.3em] leading-none">SECTOR_G_SECURE</p>
      </div>

    </div>
  );
}

export default Landing;
