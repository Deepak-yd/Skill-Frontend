import { useEffect, useState, useMemo } from "react";
import { fetchProfessionals, fetchCategories, fetchAllJobs, createHire } from "../api";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProfessionalCard from "../components/ProfessionalCard";

export default function Professionals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pros, setPros] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [p, c, j] = await Promise.all([
        fetchProfessionals(), 
        fetchCategories(),
        fetchAllJobs()
      ]);
      setPros(p || []);
      setCategories(c || []);
      setJobs(j || []);
    } catch (err) {
      console.error("Expert relay offline.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleApply = async (jobId) => {
    try {
      await createHire({ jobId });
      alert("MISSION SYNCHRONIZED: Project assigned to your node.");
      // Professionals go to Dashboard (their mission hub), others go to Hires
      navigate(user?.role === 'PROFESSIONAL' ? "/dashboard" : "/hires");
    } catch (err) {
      alert("Synchronization Failure: " + err.message);
    }
  };

  const filteredPros = useMemo(() => {
    return pros.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || 
                          p.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === "all" || p.category === selectedCategory || p.Category?.name === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [pros, search, selectedCategory]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = j.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === "all" || j.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [jobs, search, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12 animate-reveal">
         <div className="w-14 h-14 border-[4px] border-white/5 border-t-indigo-600 rounded-full animate-spin"></div>
         <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.6em] animate-pulse italic">Synchronizing Marketplace Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 animate-reveal max-w-7xl mx-auto px-4">
      
      <PageHeader 
        title="Experts & Missions" 
        subtitle="The unified marketplace for hiring elite professional nodes and broadcasting high-priority missions."
        badge={`Network_Active: ${pros.length + jobs.length} Total Data Points`}
      >
        <div className="flex flex-col lg:flex-row gap-4 premium-glass p-2.5 border-white/10 bg-white/5 rounded-[2rem] lg:rounded-full border shadow-2xl relative group">
           <div className="flex items-center gap-4 px-8 relative z-10 flex-1">
              <span className="text-xl italic grayscale group-hover:grayscale-0 transition opacity-30">🔍</span>
              <input 
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by expertise or mission title..."
                className="bg-transparent border-none outline-none text-sm font-black italic tracking-widest text-indigo-500 placeholder-slate-600 w-full"
              />
           </div>
           
           <div className="flex flex-wrap gap-2 p-1 lg:bg-white/5 lg:rounded-full relative z-10 shrink-0">
               <button 
                 onClick={() => setSelectedCategory("all")} 
                 className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic transition-all ${selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
               >
                 All_Sectors
               </button>
               {['Web', 'Design', 'AI/ML'].map(catName => (
                 <button 
                   key={catName} 
                   onClick={() => setSelectedCategory(catName)} 
                   className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic transition-all ${selectedCategory === catName ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                 >
                   {catName}
                 </button>
               ))}
           </div>

           {user?.role === "USER" && (
              <button 
                onClick={() => navigate("/jobs")} 
                className="px-12 py-3 bg-white text-slate-950 hover:bg-emerald-600 hover:text-white rounded-[2rem] lg:rounded-full font-black text-[9px] uppercase tracking-[0.5em] italic transition-all shadow-2xl active:scale-95 shrink-0"
              >
                Broadcast Mission
              </button>
           )}
        </div>
      </PageHeader>

      {/* 🌙 EXPERT NODES SECTION */}
      <div className="space-y-12">
          <div className="flex items-center justify-between px-10 border-l-[4px] border-indigo-600">
              <div className="space-y-1">
                  <h3 className="text-[12px] font-black uppercase tracking-[1em] italic leading-none opacity-40">Verified Expert Nodes</h3>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic mt-2">Active Professional Grid</p>
              </div>
              <div className="flex gap-2">
                  <span className="text-[9px] font-black text-indigo-500 opacity-40 uppercase italic tracking-widest">{filteredPros.length} Experts Online</span>
              </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {filteredPros.slice(0, 8).map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} />
             ))}
          </div>
      </div>

      {/* 🌙 MISSIONS FEED SECTION (New Dynamic Addition) */}
      <div className="space-y-12 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between px-10 border-l-[4px] border-emerald-500">
              <div className="space-y-1">
                  <h3 className="text-[12px] font-black uppercase tracking-[1em] italic leading-none opacity-40">Active Missions</h3>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic mt-2">Live Marketplace Postings</p>
              </div>
              <button onClick={() => navigate("/jobs")} className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-500 hover:text-white transition-all italic underline decoration-indigo-500/30 underline-offset-8">Browse All Jobs</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {filteredJobs.slice(0, 4).map((job) => (
                <div key={job.id} className="premium-glass p-10 bg-white/5 border-white/5 group relative overflow-hidden shadow-2xl rounded-[3rem] hover:border-emerald-500/30 flex flex-col justify-between min-h-[300px] transition-all">
                   <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-start">
                         <div className="space-y-4">
                            <div className="flex items-center gap-4">
                               <span className="px-5 py-1.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 text-[8.5px] font-black uppercase tracking-[0.2em] rounded-full italic">{job.category}</span>
                               <span className="text-slate-600 text-[9px] font-black uppercase italic opacity-40">BY: {job.user?.name || 'Client'}</span>
                            </div>
                            <h4 className="text-2xl font-black tracking-tight uppercase italic leading-tight line-clamp-2">{job.title}</h4>
                         </div>
                         <p className="text-3xl font-black italic text-emerald-500">${job.budget}</p>
                      </div>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed line-clamp-3 italic opacity-70 border-l-[2px] border-white/5 pl-6">{job.description}</p>
                   </div>
                   <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
                       <div className="flex gap-2">
                          {(job.skills || []).slice(0, 2).map(s => <span key={s} className="text-[8px] font-black text-slate-600 uppercase italic opacity-40">{s}</span>)}
                       </div>
                       <button 
                         onClick={() => handleApply(job.id)}
                         className="px-8 py-3 bg-white text-slate-950 hover:bg-emerald-600 hover:text-white rounded-xl font-black text-[8px] uppercase tracking-[0.4em] italic transition-all active:scale-95"
                       >
                         APPLY NOW
                       </button>
                   </div>
                </div>
             ))}
             {filteredJobs.length === 0 && (
                <div className="col-span-full py-24 text-center opacity-30 border-[2px] border-dashed border-white/5 rounded-[4rem]">
                   <p className="text-xl font-black italic uppercase tracking-[0.4em]">No Missions Registered in Context.</p>
                </div>
             )}
          </div>
      </div>

    </div>
  );
}
