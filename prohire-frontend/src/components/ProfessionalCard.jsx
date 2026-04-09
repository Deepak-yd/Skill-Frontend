import { useNavigate } from "react-router-dom";
import { createHire } from "../api";
import { useAuth } from "../context/useAuth";

function ProfessionalCard({ pro }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHire = async (e) => {
    e.stopPropagation();
    try {
      await createHire({
        professionalId: pro.id,
        serviceTitle: `Direct Sync Mission - ${pro.name}`,
        amount: pro.rate || 100, // Use rate from DB or fallback
        status: "Active",
        progress: 0,
        notes: "Engaging expert via ProHire Foundry marketplace discovery."
      });
      navigate("/hires");
    } catch (err) {
      console.error("Link failure:", err);
      navigate("/hires");
    }
  };

  const handleContact = (e) => {
    e.stopPropagation();
    // In a full implementation, this opens the direct profile
    navigate("/professionals"); 
  };

  // Decode skills if it's a string
  const skillsList = pro.skills ? (typeof pro.skills === 'string' ? JSON.parse(pro.skills) : pro.skills) : [];

  return (
    <div 
      className="premium-glass p-8 bg-white/5 border-white/5 group relative overflow-hidden shadow-2xl rounded-[3rem] hover:border-indigo-500/40 transition-all flex flex-col justify-between min-h-[420px]"
    >
      <div className="absolute top-0 right-0 p-8 text-5xl opacity-[0.015] grayscale pointer-events-none italic font-black uppercase leading-none group-hover:opacity-[0.05]">NODE_{pro.id}</div>
      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="space-y-8 relative z-10">
         
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shadow-inner group-hover:rotate-12 group-hover:bg-indigo-600 transition-all relative overflow-hidden">
               {pro.avatar ? (
                 <img src={pro.avatar} alt={pro.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
               ) : (
                 <span className="text-3xl font-black italic text-indigo-500 group-hover:text-white">{pro.name?.[0]?.toUpperCase()}</span>
               )}
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
               <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-black tracking-tight uppercase italic leading-none truncate pr-4">{pro.name}</h4>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_lime]"></div>
               </div>
               <p className="text-[9px] font-black text-indigo-500/60 uppercase tracking-[0.4em] italic leading-none truncate">Expert {pro.title}</p>
            </div>
         </div>

         <p className="text-slate-500 text-sm font-bold leading-relaxed line-clamp-3 italic opacity-80 pl-8 border-l-[2.5px] border-white/5">
           {pro.bio || "Verified professional expertise on the decentralized grid. Specializing in high-performance delivery."}
         </p>

         <div className="flex flex-wrap gap-2 pt-2">
            {skillsList.slice(0, 3).map(skill => (
              <span key={skill} className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8.5px] font-black text-slate-500 uppercase tracking-[0.2em] italic group-hover:border-indigo-500/20 group-hover:text-slate-400 transition-all">{skill}</span>
            ))}
            {skillsList.length > 3 && <span className="text-[8px] font-black text-slate-600 italic opacity-40 p-1">+{skillsList.length - 3}</span>}
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl text-center space-y-1.5 shadow-inner">
               <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Sector</p>
               <p className="text-[11px] font-black italic tracking-tighter leading-none uppercase truncate">{pro.category || 'Professional'}</p>
            </div>
            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl text-center space-y-1.5 shadow-inner">
               <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Resource</p>
               <p className="text-[11px] font-black italic tracking-tighter leading-none text-emerald-500">${pro.rate || '50'}<span className="text-[8.5px] font-thin opacity-50">/hr</span></p>
            </div>
         </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5 pt-8 border-t border-white/5 mt-8">
         <div className="flex items-center gap-3">
             <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-[12px] italic ${i < (pro.rating || 5) ? 'text-amber-500' : 'text-white/5'}`}>★</span>
                ))}
             </div>
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic opacity-40">{pro.reviewCount || 0} Synced</p>
         </div>
         
         <div className="flex gap-4 items-center">
            <button onClick={handleContact} className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all underline underline-offset-8 decoration-white/5 italic">Dossier</button>
            {(user?.role === "user" || user?.role === "admin") && (
              <button onClick={handleHire} className="px-10 py-3.5 bg-indigo-600 text-white rounded-[1.25rem] text-[9.5px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-white hover:text-slate-950 transition-all italic active:scale-95 leading-none">Engage Sync</button>
            )}
         </div>
      </div>
    </div>
  );
}

export default ProfessionalCard;
