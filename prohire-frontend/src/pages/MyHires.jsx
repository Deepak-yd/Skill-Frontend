import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHires, updateHire } from "../api";
import { useAuth } from "../context/useAuth";
import PageHeader from "../components/PageHeader";

function MyHires() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("All");
  const [hires, setHires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHires();
      setHires(data || []);
    } catch (err) {
      setError("Unable to load hires. Working link offline.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredHires = useMemo(
    () => (hires || []).filter((hire) => filterStatus === "All" || hire.status === filterStatus),
    [hires, filterStatus]
  );

  const handleComplete = async (hire) => {
    try {
      await updateHire(hire.id, { status: "Completed", progress: 100 });
      await loadData();
    } catch (err) {
      alert("Error marking project as done.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-10 animate-reveal">
         <div className="w-12 h-12 border-[3px] border-white/5 border-t-indigo-600 rounded-full animate-spin"></div>
         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] animate-pulse italic">Scanning Your Projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 animate-reveal">
      
      {/* 🌙 EXTREME COMPACT HIRES HEADER */}
      <PageHeader 
        title="My Projects" 
        subtitle="Track your current work and ensure professional payments."
        badge="Active Work Streams"
      >
        <div className="glass-panel p-2.5 bg-white/5 border-white/5 shadow-2xl flex gap-2 rounded-full border-[2px]">
          {["All", "Active", "Completed", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-8 py-3 rounded-full text-[8.5px] font-black uppercase tracking-[0.25em] font-mono italic transition-all ${filterStatus === status
                  ? "bg-emerald-600 text-white shadow-xl scale-105"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </PageHeader>

      {error && <div className="p-8 bg-pink-50 border border-pink-100 rounded-3xl text-pink-600 text-center text-[10px] font-black uppercase tracking-[0.5em] italic leading-none">{error}</div>}

      <div className="grid gap-10">
        {filteredHires.map((hire) => (
          <div key={hire.id} className="tactile-node p-10 bg-white/5 border-white/5 group relative overflow-hidden shadow-2xl rounded-[2.5rem] hover:border-emerald-500/50 flex flex-col min-h-[300px]">
             <div className="absolute top-0 left-0 w-[3.5px] h-full bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-10 group-hover:opacity-100 transition-opacity"></div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 w-full flex-1">
                {/* 🌙 COMPACT PROJECT INFO */}
                <div className="lg:col-span-5 space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/10 flex items-center justify-center font-black text-emerald-500 text-3xl shadow-inner group-hover:rotate-6 transition-all group-hover:bg-emerald-600 group-hover:text-white italic">
                        {hire.serviceTitle?.[0] || 'P'}
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                         <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black group-hover:text-emerald-500 transition tracking-tighter uppercase italic leading-none truncate">{hire.serviceTitle}</h3>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-2xl"></div>
                         </div>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] italic leading-none truncate pr-4">{hire.professionalName || 'Verified Expert'}</p>
                      </div>
                   </div>
                   {hire.notes && <p className="text-sm text-slate-500 font-bold italic leading-relaxed line-clamp-2 max-w-sm opacity-60">"{hire.notes}"</p>}
                </div>

                {/* 🌙 MINI PROGRESS RING */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-4">
                   <div className="relative w-28 h-28 group/ring filter drop-shadow-xl">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                         <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="6"
                           strokeDasharray={314} strokeDashoffset={314 - (314 * hire.progress) / 100}
                           className={`${hire.status === 'Completed' ? 'text-emerald-500' : 'text-indigo-600'} transition-all duration-1000 group-hover:stroke-[8]`}
                         />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono italic leading-none">WORK</span>
                         <span className="text-2xl font-black italic leading-none mt-1">{hire.progress}%</span>
                      </div>
                   </div>
                </div>

                {/* 🌙 COMPACT FINANCIAL DATA */}
                <div className="lg:col-span-3 text-center lg:text-right space-y-3">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] italic leading-none">Total Payment</p>
                   <p className="text-4xl font-black tracking-[-0.05em] italic leading-none text-emerald-500">${hire.amount || '0'}</p>
                   <p className="text-[8.5px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none italic opacity-40">Payment: Nominal</p>
                </div>

                {/* 🌙 COMPACT OPERATIONS */}
                <div className="lg:col-span-12 flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-white/5 items-center justify-between">
                   <div className="flex gap-1.5 opacity-10">
                      {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>)}
                   </div>
                   <div className="flex gap-3 w-full sm:w-auto">
                      <button
                         onClick={() => navigate("/professionals")}
                         className="flex-1 sm:px-8 py-3.5 bg-white/5 border border-white/5 hover:border-white text-slate-400 hover:text-white rounded-xl text-[8.5px] font-black uppercase tracking-[0.4em] transition active:scale-95 italic shadow-md"
                      >
                         Expert Profile
                      </button>
                      {user?.role !== "professional" && hire.status !== "Completed" && (
                         <button
                           onClick={() => handleComplete(hire)}
                           className="flex-1 sm:px-12 py-3.5 bg-emerald-600 text-white rounded-xl text-[8px] font-black uppercase tracking-[0.5em] shadow-2xl active:scale-95 italic hover:bg-slate-950 transition-all leading-none"
                         >
                           Mark as Done
                         </button>
                      )}
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MyHires;
