<<<<<<< HEAD
import { useAuth } from "../context/useAuth";
import UserDashboard from "./UserDashboard";
import ProfessionalDashboard from "./ProfessionalDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role?.toUpperCase()) {
      case "ADMIN":
        return <AdminDashboard user={user} />;
      case "PROFESSIONAL":
        return <ProfessionalDashboard user={user} />;
      case "USER":
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderDashboard()}
=======
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { fetchDashboardMetrics, fetchHires } from "../api";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [myMissions, setMyMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const [m, h] = await Promise.all([
          fetchDashboardMetrics(), 
          fetchHires()
        ]);
        setMetrics(m);
        // If professional, these are their working missions. If user, these are their hires.
        setMyMissions((h || []).slice(0, 4));
      } catch (err) {
        console.error("Dashboard telemetry relay offline.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const quickOps = [
    { label: "Post Project", icon: "➕", path: "/jobs", color: "bg-indigo-600" },
    { label: "Find Experts", icon: "🔍", path: "/professionals", color: "bg-emerald-600" },
    { label: user?.role === 'PROFESSIONAL' ? "Peer Sync" : "Track Hires", icon: user?.role === 'PROFESSIONAL' ? "🔗" : "📊", path: user?.role === 'PROFESSIONAL' ? "/connections" : "/hires", color: "bg-amber-600" },
    { label: "Profile", icon: "⚙️", path: "/profile", color: "bg-purple-600" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-10 animate-reveal">
         <div className="w-12 h-12 border-[3px] border-white/5 border-t-indigo-600 rounded-full animate-spin"></div>
         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] animate-pulse italic">Syncing Marketplace Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 animate-reveal pb-20">
      
      <PageHeader 
        title={user?.role === 'PROFESSIONAL' ? "Expert Dashboard" : "Operations Center"} 
        subtitle={user?.role === 'PROFESSIONAL' ? "Manage your high-priority missions and active peer connections." : "Enterprise oversight and expert node management center."}
        badge={`Priority: ${user?.role?.toUpperCase() || 'PEER'}`}
      >
        <div className="tactile-node p-8 bg-white/5 border-white/5 shadow-2xl flex items-center gap-10 group rounded-[2.5rem] h-full min-h-[120px] max-w-sm">
           <div className={`w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-black italic shadow-2xl transition-transform`}>
              {user?.name?.[0]?.toUpperCase()}
           </div>
           <div className="space-y-1 flex-1 min-w-0">
              <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none truncate">{user?.name}</h2>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] leading-none italic opacity-60 truncate">{user?.email}</p>
           </div>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-4 gap-8">
        {[
          { label: "Total Missions", value: user?.role === 'PROFESSIONAL' ? myMissions.length : (metrics?.totalServices || 0), icon: "🚀", color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Expert Node Pool", value: metrics?.totalProfessionals || 0, icon: "🎖️", color: "text-teal-500", bg: "bg-teal-500/10" },
          { label: "Grid Volume", value: `$${metrics?.totalRevenue || 0}`, icon: "💰", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Connection Strength", value: "98.4%", icon: "⚡", color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((stat, i) => (
          <div key={i} className="tactile-node p-10 bg-white/5 border-white/5 shadow-2xl rounded-[3rem] min-h-[220px] flex flex-col justify-between group cursor-pointer hover:border-emerald-500/40 transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-xl mb-8 shadow-inner italic group-hover:scale-110 transition`}>
              {stat.icon}
            </div>
            <div className="space-y-3">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 italic leading-none opacity-40">{stat.label}</p>
              <h3 className={`text-4xl font-black ${stat.color} tracking-[-0.05em] shimmer-text leading-none italic uppercase`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-stretch">
        
        {/* ACTIVE MISSIONS / HIRES GRID */}
        <div className="lg:col-span-8 glass-panel p-12 bg-white/5 border-white/5 shadow-2xl tactile-node flex flex-col rounded-[3.5rem] min-h-[450px]">
           <div className="flex items-center justify-between mb-10 border-l-[3px] border-emerald-500 px-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] italic opacity-40">{user?.role === 'PROFESSIONAL' ? "Mission Status" : "Recent Hires"}</h3>
              <button onClick={() => navigate(user?.role === 'PROFESSIONAL' ? "/jobs" : "/hires")} className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500 italic">Maximize View</button>
           </div>
           
           <div className="space-y-4 flex-1">
              {myMissions.length > 0 ? (
                myMissions.map((item, i) => (
                  <div key={i} className="p-6 bg-white/3 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500 italic"> {item.serviceTitle?.[0]} </div>
                        <div className="space-y-1">
                           <p className="text-[14px] font-black italic uppercase leading-none">{item.serviceTitle}</p>
                           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.status || 'ACTIVE_SYNC'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black italic text-emerald-500">${item.amount}</p>
                     </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                   <p className="text-4xl">🌫️</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.5em] italic">No active work stream detected.</p>
                </div>
              )}
           </div>
        </div>

        {/* NOTIFICATIONS PANEL */}
        <div className="lg:col-span-4 glass-panel p-10 bg-white/5 border-white/5 shadow-2xl tactile-node rounded-[3.5rem] h-full min-h-[450px] flex flex-col hover:border-indigo-500/50 transition-all group">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] mb-10 text-center italic border-b border-white/5 pb-8 opacity-40">Operational Feed</h3>
             <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                {[
                  { text: "Mission successfully uplinked to grid.", time: "2m ago", type: "sync" },
                  { text: "Connection confirmed with Expert_Node.", time: "15m ago", type: "user" },
                  { text: "New message in encrypted channel #04.", time: "1h ago", type: "msg" },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-2 group/msg hover:bg-white/10 transition-all cursor-pointer shadow-sm">
                     <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.5em]">
                        <span className="text-indigo-500 italic">SYSTEM_SIGNAL</span>
                        <span className="text-slate-600 opacity-60">{item.time}</span>
                     </div>
                     <p className="text-[12px] font-black text-slate-400 italic leading-none">{item.text}</p>
                  </div>
                ))}
             </div>
        </div>
      </div>

>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb
    </div>
  );
}

export default Dashboard;
