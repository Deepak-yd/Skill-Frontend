import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/useAuth";
import {
  fetchAllJobs,
  fetchCategories,
  createJob,
  updateJob,
  deleteJob,
  createHire,
} from "../api";
import PageHeader from "../components/PageHeader";

export default function Jobs() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "", description: "", skills: [], budget: "", category: "", status: "open",
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [jobs, cats] = await Promise.all([fetchAllJobs(), fetchCategories()]);
      setAllJobs(jobs || []);
      setCategories(cats || []);
    } catch (err) {
      console.error("Job board sync failed.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsPublishing(true);
      const payload = { ...formData };
      // Auto-extract skills if none provided
      if (payload.skills.length === 0) {
        payload.skills = payload.title.split(' ').filter(word => word.length > 3).slice(0, 3);
      }
      
      if (editingJob) await updateJob(editingJob.id, payload);
      else await createJob(payload);
      
      setFormData({ title: "", description: "", skills: [], budget: "", category: "", status: "open" });
      setShowForm(false);
      setEditingJob(null);
      await loadData();
    } catch (err) { 
      alert("Mission Uplink Failed: " + err.message); 
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this mission?")) return;
    try {
      await deleteJob(id);
      await loadData();
    } catch (err) { alert(err.message); }
  };

  const handleApply = async (jobId) => {
    try {
      await createHire({ jobId });
      alert("MISSION SYNCHRONIZED: Project assigned to your node.");
      navigate(user?.role === 'PROFESSIONAL' ? "/dashboard" : "/hires");
    } catch (err) {
      alert("Synchronization Failure: " + err.message);
    }
  };

  const filteredVisibleJobs = useMemo(() => 
    (allJobs || []).filter(j => activeFilter === 'all' || j.category?.toLowerCase() === activeFilter.toLowerCase()),
  [allJobs, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-reveal">
         <div className="w-12 h-12 border-[3px] border-white/5 border-t-indigo-600 rounded-full animate-spin"></div>
         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] animate-pulse italic">Scanning Job Board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-reveal max-w-7xl mx-auto px-4">
      
      <PageHeader 
        title="Jobs" 
        subtitle="Explore available projects or post your own mission for the elite professional network."
        badge="Market Status: Active"
      >
        <div className="flex flex-col sm:flex-row gap-3 premium-glass p-2 border-white/10 bg-white/5 rounded-full border shadow-xl">
            <div className="flex gap-1 p-1 bg-white/5 rounded-full">
               {['all', 'Web', 'Design', 'AI/ML'].map(f => (
                   <button key={f} onClick={() => setActiveFilter(f)} className={`px-8 py-2.5 rounded-full text-[8.5px] font-black uppercase tracking-[0.2em] italic transition-all ${activeFilter === f ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-white'}`}>
                       {f}
                   </button>
               ))}
            </div>
            {(user?.role === "USER" || user?.role === "ADMIN" || user?.role === "PROFESSIONAL") && (
                <button
                    onClick={() => { setShowForm(!showForm); setEditingJob(null); }}
                    className={`px-8 py-2.5 font-black uppercase tracking-[0.4em] text-[8.5px] rounded-full transition-all shadow-xl italic ${showForm ? "bg-white text-slate-950" : "bg-indigo-600 text-white"}`}
                >
                    {showForm ? "Cancel" : "Post Mission"}
                </button>
            )}
        </div>
      </PageHeader>

      {showForm && (
        <div className="max-w-4xl mx-auto animate-reveal">
            <div className="premium-glass p-12 bg-white/5 border-white/10 shadow-2xl relative overflow-hidden group/forge border-[2.5rem] rounded-[3.5rem]">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-12 italic leading-none">{editingJob ? 'RECONFIGURE MISSION' : 'POST NEW JOB'}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic px-1 pl-4 border-l-[3px] border-indigo-600">Job Title</label>
                            <input 
                              value={formData.title} 
                              onChange={(e) => setFormData({...formData, title: e.target.value})} 
                              placeholder="Mission Identifier" 
                              className="input-premium w-full bg-white/5 border-white/10 text-xl font-black italic shadow-inner py-6 px-8 rounded-2xl" 
                              required 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic px-1 pl-4 border-l-[3px] border-indigo-600">Budget ($)</label>
                            <input 
                              type="number"
                              value={formData.budget} 
                              onChange={(e) => setFormData({...formData, budget: e.target.value})} 
                              placeholder="Resource Amount" 
                              className="input-premium w-full bg-white/5 border-white/10 text-xl font-black italic shadow-inner py-6 px-8 rounded-2xl" 
                              required 
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic px-1 pl-4 border-l-[3px] border-indigo-600">Category</label>
                        <div className="relative group/select">
                          <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            className="input-premium w-full bg-white/5 border-white/10 text-sm font-black italic shadow-inner py-6 px-8 rounded-2xl outline-none appearance-none cursor-pointer uppercase tracking-[0.3em]"
                            required
                          >
                              <option value="" className="bg-slate-900">SELECT CLASSIFICATION</option>
                              <option value="Web" className="bg-slate-900">WEB</option>
                              <option value="Design" className="bg-slate-900">DESIGN</option>
                              <option value="AI/ML" className="bg-slate-900">AI/ML</option>
                          </select>
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic px-1 pl-4 border-l-[3px] border-indigo-600">Description</label>
                        <textarea 
                          value={formData.description} 
                          onChange={(e) => setFormData({...formData, description: e.target.value})} 
                          placeholder="Detail the mission parameters..." 
                          className="input-premium w-full min-h-[180px] bg-white/5 border-white/10 p-10 italic text-sm font-bold shadow-inner rounded-[2.5rem] leading-relaxed" 
                          required 
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-white/5 items-stretch">
                        <button 
                          type="submit" 
                          disabled={isPublishing}
                          className="flex-1 py-8 bg-white text-slate-950 hover:bg-indigo-600 hover:text-white rounded-[1.5rem] shadow-2xl transition-all font-black text-[10px] uppercase tracking-[0.6em] italic active:scale-95 disabled:opacity-50"
                        >
                          {isPublishing ? 'PUBLISHING MISSION...' : (editingJob ? 'UPDATE MISSION' : 'PUBLISH JOB')}
                        </button>
                        <button 
                          onClick={() => setShowForm(false)} 
                          type="button" 
                          className="px-12 py-8 bg-white/5 text-slate-500 hover:text-white hover:bg-pink-600/10 font-black uppercase text-[10px] tracking-[0.4em] rounded-[1.5rem] transition-all italic"
                        >
                          DISCARD
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="space-y-10">
          <div className="flex items-center justify-between px-8 border-l-[3px] border-emerald-600 mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.8em] italic opacity-40">Global Feed</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredVisibleJobs.map((job) => (
              <div key={job.id} className="premium-glass p-10 bg-white/5 border-white/10 group relative overflow-hidden shadow-2xl rounded-[3rem] hover:border-emerald-500/30 flex flex-col justify-between min-h-[350px] transition-all">
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start gap-6">
                      <div className="space-y-5 flex-1 min-w-0">
                          <div className="flex items-center gap-5">
                              <span className="px-5 py-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 text-[8.5px] font-black uppercase tracking-[0.3em] rounded-full italic">{job.category}</span>
                              <span className="text-slate-500 text-[8.5px] font-black uppercase italic opacity-30 tracking-widest">BY: {job.user?.name || 'Client'}</span>
                          </div>
                          <h4 className="text-3xl font-black tracking-tight uppercase italic leading-tight line-clamp-2 pr-12">{job.title}</h4>
                      </div>
                      <div className="text-right">
                          <p className="text-4xl font-black italic leading-none text-emerald-500 transition-all group-hover:scale-110">${job.budget}</p>
                      </div>
                  </div>

                  <p className="text-slate-500 text-base font-bold leading-relaxed line-clamp-3 italic opacity-80 pl-8 border-l-[2.5px] border-white/5">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5 mt-10">
                  <div className="flex flex-wrap gap-2.5">
                      {(job.skills || []).length > 0 ? (
                        job.skills.map(skill => (
                          <span key={skill} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8.5px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{skill}</span>
                        ))
                      ) : (
                        <span className="text-[8.5px] font-black text-slate-600 uppercase italic opacity-30">Universal Requirements</span>
                      )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {(user?.id === job.userId || user?.role === "ADMIN") ? (
                      <div className="flex gap-4">
                        <button onClick={() => { setEditingJob(job); setFormData(job); setShowForm(true); }} className="text-[10px] font-black uppercase text-indigo-500 hover:text-white transition-all underline decoration-indigo-500/30 underline-offset-8 italic">Edit</button>
                        <button onClick={() => handleDelete(job.id)} className="text-[10px] font-black uppercase text-pink-500 hover:text-white transition-all underline decoration-pink-500/30 underline-offset-8 italic">Remove</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleApply(job.id)}
                        className="px-10 py-4 bg-emerald-600 text-white rounded-[1rem] text-[9.5px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-white hover:text-slate-950 transition-all italic active:scale-95"
                      >
                        APPLY NOW
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredVisibleJobs.length === 0 && (
              <div className="col-span-full py-32 text-center opacity-30 border-[2px] border-dashed border-white/5 rounded-[4rem]">
                <p className="text-2xl font-black italic uppercase tracking-[0.4em]">No missions detected in this sector.</p>
              </div>
            )}
          </div>
      </div>

    </div>
  );
}
