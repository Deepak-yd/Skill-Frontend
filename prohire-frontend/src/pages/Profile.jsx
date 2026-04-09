import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  createService,
  deleteService,
  fetchCategories,
  fetchMyProfessionalProfile,
  fetchProfessionals,
  fetchServices,
  getCurrentUser,
  updateMyProfile,
  updateProfessional,
  updateService,
} from "../api";
import { useAuth } from "../context/useAuth";

function Profile() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const professionalId = searchParams.get("professionalId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewProfessional, setViewProfessional] = useState(null);
  const [myProfessional, setMyProfessional] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    location: "",
    company: "",
    website: "",
    bio: "",
    linkedIn: "",
    github: "",
    twitter: "",
    portfolio: "",
    title: "",
    hourlyRate: 0,
    skills: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [serviceForm, setServiceForm] = useState({ id: "", title: "", description: "", price: "" });

  const isViewingOtherProfessional = Boolean(professionalId);
  const canEditOwnProfile = !isViewingOtherProfessional;
  const canManageServices = canEditOwnProfile && user?.role === "PROFESSIONAL";

  const profileTitle = useMemo(() => {
    if (isViewingOtherProfessional) return "Target Operational Intel";
    if (user?.role === "ADMIN") return "High-Level Admin Vault";
    if (user?.role === "PROFESSIONAL") return "Elite Agent Identity";
    return "Member Authentication";
  }, [isViewingOtherProfessional, user?.role]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const me = await getCurrentUser();

        if (professionalId) {
          const pros = await fetchProfessionals();
          const selected = pros.find((p) => String(p.id) === String(professionalId));
          if (!selected) throw new Error("Professional not found");
          setViewProfessional(selected);
          setServices(await fetchServices(selected.id));
          return;
        }

        setProfileForm({
          name: me.name || "",
          phone: me.profile?.phone || "",
          location: me.profile?.location || "",
          company: me.profile?.company || "",
          website: me.profile?.website || "",
          bio: me.profile?.bio || "",
          linkedIn: me.linkedIn || "",
          github: me.github || "",
          twitter: me.twitter || "",
          portfolio: me.portfolio || "",
          title: "",
          hourlyRate: 0,
          skills: "",
        });

        if (me.role === "PROFESSIONAL") {
          const pro = await fetchMyProfessionalProfile();
          setMyProfessional(pro);
          setServices(await fetchServices(pro.id));
          setCategories(await fetchCategories());
          setProfileForm((prev) => ({
            ...prev,
            title: pro.title || "",
            location: pro.location || prev.location,
            bio: pro.bio || prev.bio,
            hourlyRate: Number(String(pro.rate).replace(/[^0-9]/g, "")) || 0,
            skills: (pro.skills || []).join(", "),
          }));
        }
      } catch (err) {
        setError(err.message || "Mainframe handshake failed");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [professionalId]);

  const handleSaveProfile = async () => {
    try {
      setError("");
      const userPayload = {
        fullName: profileForm.name,
        profile: {
          phone: profileForm.phone,
          location: profileForm.location,
          company: profileForm.company,
          website: profileForm.website,
          bio: profileForm.bio,
          linkedIn: profileForm.linkedIn,
          github: profileForm.github,
          twitter: profileForm.twitter,
          portfolio: profileForm.portfolio,
        }
      };

      await updateMyProfile(userPayload);
      if (myProfessional) {
        await updateProfessional(myProfessional.id, {
          title: profileForm.title,
          rateValue: Number(profileForm.hourlyRate || 0),
          skills: profileForm.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        });
        const refreshed = await fetchMyProfessionalProfile();
        setMyProfessional(refreshed);
      }

      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Identity update failed");
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!myProfessional) return;

    try {
      if (serviceForm.id) {
        await updateService(myProfessional.id, serviceForm.id, {
          title: serviceForm.title,
          description: serviceForm.description,
          price: Number(serviceForm.price || 0),
        });
      } else {
        await createService(myProfessional.id, {
          title: serviceForm.title,
          description: serviceForm.description,
          price: Number(serviceForm.price || 0),
        });
      }

      setServices(await fetchServices(myProfessional.id));
      setServiceForm({ id: "", title: "", description: "", price: "" });
    } catch (err) {
      setError(err.message || "Forge operation interrupted");
    }
  };

  const handleDeleteService = async (id) => {
    if (!myProfessional) return;
    if (!window.confirm("Terminate this operational capability?")) return;
    try {
      await deleteService(myProfessional.id, id);
      setServices(await fetchServices(myProfessional.id));
    } catch (err) {
      setError(err.message || "Erasure failed");
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center">
           <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
     );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 animate-reveal opacity-0">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Shield */}
        <div className="glass-panel p-10 relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-transparent">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex items-center gap-10">
                 <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-500/10 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-500 hover:rotate-6 shadow-2xl">
                       {isViewingOtherProfessional && viewProfessional?.avatar ? (
                          <img src={viewProfessional.avatar} alt={viewProfessional.name} className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-4xl">👤</span>
                       )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 text-white rounded-2xl flex items-center justify-center border-4 border-slate-950 font-black text-[10px] animate-pulse">
                       98%
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                          Identity Verified
                       </span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-2">
                       {isViewingOtherProfessional ? viewProfessional?.name : user?.name}
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                       {profileTitle} // {isViewingOtherProfessional ? viewProfessional?.title : (user?.role === 'PROFESSIONAL' ? myProfessional?.title : "System User")}
                    </p>
                 </div>
              </div>
              {canEditOwnProfile && (
                 <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className={`px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                    isEditing ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  }`}
                 >
                    {isEditing ? "Finalise Override" : "Modify Core Identity"}
                 </button>
              )}
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Detailed Information Containers */}
           <div className="lg:col-span-2 space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                 <div className="glass-panel p-10 space-y-8 bg-slate-900/40">
                    <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Primary Metadata</h3>
                    {[
                      { key: "location", label: "Operational Hub", icon: "📍" },
                      { key: "website", label: "External Nexus", icon: "🌐" },
                      { key: "linkedIn", label: "Neural Network", icon: "🔗" },
                      { key: "github", label: "Code Repository", icon: "📂" },
                    ].map(field => (
                      <div key={field.key}>
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{field.label}</label>
                         <div className="relative group">
                            <span className="absolute left-0 text-slate-800 top-1/2 -translate-y-1/2">{field.icon}</span>
                            <input
                               disabled={!isEditing}
                               value={profileForm[field.key]}
                               onChange={(e) => setProfileForm(f => ({...f, [field.key]: e.target.value}))}
                               className={`w-full bg-transparent border-b pl-8 py-2 text-sm font-bold transition-all focus:outline-none ${
                                 isEditing ? "border-indigo-500/50 text-white" : "border-white/5 text-slate-400"
                               }`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="glass-panel p-10 bg-slate-900/40">
                    <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Capability Heatmap</h3>
                    <div className="space-y-6 mt-8">
                       {[
                         { label: "Technical Fluency", val: 94, color: "bg-indigo-500" },
                         { label: "Neural Adaptation", val: 88, color: "bg-purple-500" },
                         { label: "Project Velocity", val: 97, color: "bg-pink-500" },
                         { label: "Security Posture", val: 99, color: "bg-emerald-500" },
                       ].map(skill => (
                          <div key={skill.label}>
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                <span className="text-slate-500">{skill.label}</span>
                                <span className="text-white">{skill.val}%</span>
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div style={{ width: `${skill.val}%` }} className={`h-full ${skill.color} animate-pulse-glow`}></div>
                             </div>
                          </div>
                       ))}
                    </div>
                    
                    <div className="mt-12 pt-10 border-t border-white/5">
                       <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-4">Field Expertise</p>
                       <div className="flex flex-wrap gap-2">
                          {(profileForm.skills || "Development, Design, AI, Cloud").split(",").map(skill => (
                             <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 uppercase">
                                {skill.trim()}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-panel p-10 bg-slate-900/40">
                 <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-8">Operational Brief</h3>
                 <textarea
                    disabled={!isEditing}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(f => ({...f, bio: e.target.value}))}
                    className={`w-full bg-white/5 border border-white/5 rounded-2xl p-8 text-sm font-medium leading-relaxed transition-all focus:outline-none min-h-[200px] ${
                      isEditing ? "border-indigo-500/20 text-white" : "text-slate-500"
                    }`}
                    placeholder="Encrypted transmission brief pending..."
                 />
                 {isEditing && (
                    <div className="mt-8 flex gap-4">
                       <button onClick={handleSaveProfile} className="btn-glow flex-1 py-5 font-black uppercase tracking-widest text-[10px]">
                          Push Identity Change
                       </button>
                    </div>
                 )}
              </div>

              <div className="glass-panel p-10 bg-slate-900/40">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Operational Capabilities</h3>
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 </div>

                 {canManageServices && (
                    <form onSubmit={handleServiceSubmit} className="space-y-4 mb-10 pb-10 border-b border-white/5">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm(s => ({...s, title: e.target.value}))}
                            placeholder="Capability Title"
                            className="form-input"
                            required
                          />
                          <input
                            type="number"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm(s => ({...s, price: e.target.value}))}
                            placeholder="Forge Value ($)"
                            className="form-input"
                            required
                          />
                       </div>
                       <input
                         value={serviceForm.description}
                         onChange={(e) => setServiceForm(s => ({...s, description: e.target.value}))}
                         placeholder="Technical description of this operational sequence..."
                         className="form-input"
                         required
                       />
                       <button type="submit" className="w-full py-4 bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-500/20 transition hover:bg-indigo-600">
                          {serviceForm.id ? "Update Sequence" : "Forge New Capability"}
                       </button>
                    </form>
                 )}

                 <div className="grid sm:grid-cols-2 gap-6">
                    {services.map(s => (
                       <div key={s.id} className="p-8 bg-white/5 border border-white/5 rounded-3xl group relative overflow-hidden transition-all hover:bg-white/10 hover:border-white/20">
                          <div className="relative z-10">
                             <h4 className="text-white font-black text-sm uppercase tracking-wider mb-2">{s.title}</h4>
                             <p className="text-slate-500 text-[10px] mb-6 font-medium leading-relaxed">{s.description}</p>
                             <div className="flex justify-between items-end">
                                <p className="text-indigo-400 font-black text-xl italic">{s.priceLabel}</p>
                                {canManageServices && (
                                   <div className="flex gap-4">
                                      <button onClick={() => setServiceForm({ id: s.id, title: s.title, description: s.description, price: s.price })} className="text-[8px] font-black uppercase text-indigo-500 hover:text-white transition">Modify</button>
                                      <button onClick={() => handleDeleteService(s.id)} className="text-[8px] font-black uppercase text-pink-500 hover:text-white transition">Sever</button>
                                   </div>
                                )}
                             </div>
                          </div>
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-transparent -mr-8 -mt-8 rounded-full border border-white/5"></div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Personal Sidecard Detail */}
           <div className="lg:col-span-1 space-y-8">
              <div className="glass-panel p-8 bg-slate-900/60 border-indigo-500/20">
                 <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-10">Mission Authority</h3>
                 <div className="space-y-8">
                    <div>
                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-3">Foundry UID</p>
                        <p className="text-white font-bold text-sm tracking-tight font-mono">{String(user?.id || '00-00-00').padStart(8, '0')}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-3">Sync Status</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 font-black uppercase text-[8px] tracking-[0.2em]">
                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                           Synchronized
                        </div>
                    </div>
                    {user?.role === 'PROFESSIONAL' && (
                       <div>
                          <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-3">Financial Allocation</p>
                          <p className="text-4xl font-black text-white tracking-tighter">${profileForm.hourlyRate}<span className="text-xs text-slate-600 font-black uppercase ml-1 italic">/per hr</span></p>
                       </div>
                    )}
                    <div className="pt-8 border-t border-white/5">
                       <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-4">Neural Strength</p>
                       <div className="grid grid-cols-5 gap-1">
                          {[...Array(5)].map((_, i) => (
                             <div key={i} className={`h-1.5 rounded-sm ${i < 4 ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-slate-800'}`}></div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-panel p-8 bg-slate-900/20">
                 <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Personal identity is locked within the ProHire Neural Foundry. All changes are logged to the transaction ledger for platform security audit.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
