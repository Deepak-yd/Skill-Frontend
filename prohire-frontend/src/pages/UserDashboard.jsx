import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHires, fetchDashboardMetrics } from "../api";
import PageHeader from "../components/PageHeader";
import ShareComponent from "../components/ShareComponent";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [hires, setHires] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [h, m] = await Promise.all([fetchHires(), fetchDashboardMetrics()]);
        setHires(h || []);
        setMetrics(m);
      } catch (err) {
        console.error("User telemetry failed");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-reveal">
      <div className="w-12 h-12 border-[3px] border-white/5 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] animate-pulse italic">Loading User Hub...</p>
    </div>
  );

  return (
    <div className="space-y-24 animate-reveal pb-20">
      <PageHeader 
        title="Client Hub" 
        subtitle="Manage your elite resource network and track mission progress."
        badge="Node: Requester"
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {[
          { label: "Active Hires", value: hires.length, icon: "🤝", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Expert Node Pool", value: metrics?.totalProfessionals || 0, icon: "🎖️", color: "text-teal-500", bg: "bg-teal-500/10" },
          { label: "Total Budget Locked", value: `$${hires.reduce((acc, h) => acc + (h.amount || 0), 0)}`, icon: "💰", color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Success Rate", value: "99.2%", icon: "⚡", color: "text-indigo-500", bg: "bg-indigo-500/10" }
        ].map((stat, i) => (
          <div key={i} className="tactile-node p-10 bg-white/5 border-white/5 shadow-2xl rounded-[3rem] group hover:border-emerald-500/40 transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-xl mb-8 italic`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 italic opacity-40">{stat.label}</p>
              <h3 className={`text-4xl font-black ${stat.color} tracking-tight leading-none italic uppercase`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 glass-panel p-12 bg-white/5 border-white/5 rounded-[3.5rem] shadow-2xl">
           <div className="flex items-center justify-between mb-10 border-l-[3px] border-emerald-500 px-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] italic opacity-40">Recent Resource Transfers</h3>
              <button onClick={() => navigate("/hires")} className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500 italic">View My Hires</button>
           </div>
           
           <div className="space-y-4">
              {hires.slice(0, 5).map((hire, i) => (
                <div key={i} className="p-6 bg-white/3 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500 italic"> {hire.serviceTitle?.[0]} </div>
                      <div className="space-y-1">
                         <p className="text-[14px] font-black italic uppercase leading-none">{hire.serviceTitle}</p>
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{hire.professionalName || 'Expert Node'}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-black italic text-emerald-500">${hire.amount}</p>
                      <p className="text-[8px] font-black text-slate-600 uppercase italic">Paid</p>
                   </div>
                </div>
              ))}
              {hires.length === 0 && (
                <div className="py-20 text-center opacity-20 italic font-black uppercase text-[10px] tracking-widest">
                  No active resource streams found.
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel p-10 bg-white/5 border-white/5 rounded-[3rem] shadow-2xl flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-indigo-600/20 text-indigo-500 rounded-full text-2xl">🔍</div>
              <h4 className="text-xl font-black italic uppercase tracking-tighter">Need an Expert?</h4>
              <p className="text-sm text-slate-500 font-bold italic leading-relaxed">System scan suggests searching the Professional Grid for your next mission expansion.</p>
              <button 
                onClick={() => navigate("/professionals")}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] italic shadow-xl hover:bg-white hover:text-slate-950 transition-all"
              >
                Scan Grid
              </button>
           </div>
           <div className="glass-panel p-10 bg-white/5 border-white/5 rounded-[3rem] shadow-2xl flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-emerald-600/20 text-emerald-500 rounded-full text-2xl">➕</div>
              <h4 className="text-xl font-black italic uppercase tracking-tighter">Post Mission</h4>
              <p className="text-sm text-slate-500 font-bold italic leading-relaxed">Broadcast your requirements to the entire elite professional network.</p>
              <button 
                onClick={() => navigate("/jobs")}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] italic shadow-xl hover:bg-white hover:text-slate-950 transition-all"
              >
                Uplink Mission
              </button>
           </div>
           
           <ShareComponent 
             title="My User Hub Dashboard" 
             url="https://hirepro.net/user-hub" 
           />
        </div>
      </div>
    </div>
  );
}
