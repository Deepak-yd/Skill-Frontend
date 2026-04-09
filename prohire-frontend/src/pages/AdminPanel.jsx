import { useEffect, useMemo, useState } from "react";
import {
  createUser,
  deleteUser,
  fetchDashboardMetrics,
  fetchPlatformSettings,
  fetchProfessionals,
  fetchReports,
  fetchUsers,
  updatePlatformSettings,
  updateUser,
} from "../api";
import { useAuth } from "../context/useAuth";
import PageHeader from "../components/PageHeader";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "reports", label: "Reports", icon: "📈" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function AdminPanel() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState(null);
  const [settings, setSettings] = useState({ platformName: "", commissionRate: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setIsLoading(true);
        if (activeTab === "dashboard") setMetrics(await fetchDashboardMetrics());
        if (activeTab === "users") setUsers(await fetchUsers());
        if (activeTab === "reports") setReports(await fetchReports());
        if (activeTab === "settings") setSettings(await fetchPlatformSettings());
      } catch (err) {
        if (isMounted) setError(`Access Denied: ${activeTab} sector.`);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [activeTab]);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      await createUser(newUser);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      setUsers(await fetchUsers());
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await updateUser(user.id, { status: user.status === "Active" ? "Inactive" : "Active" });
      setUsers(await fetchUsers());
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading && !metrics && !users.length) {
     return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-reveal">
          <div className="w-12 h-12 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] animate-pulse italic">Synchronizing Admin Panel...</p>
       </div>
     );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 animate-reveal">
      
      {/* 🌙 COMPACT SIDEBAR */}
      <aside className="lg:w-80"> 
        <div className="premium-glass p-8 bg-white border-white/10 sticky top-40 tactile-node shadow-2xl rounded-[2.5rem] border-[1.5px]">
           <div className="flex items-center gap-4 mb-12 px-4 pt-4">
              <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-xl italic">A</div>
              <div className="space-y-1">
                 <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] leading-none mb-1">Platform Admin</h2>
                 <p className="text-[8.5px] font-black text-slate-400 uppercase tracking-[0.25em] italic leading-none">Level 99 Authority</p>
              </div>
           </div>

           <nav className="space-y-2 px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-black text-[9px] uppercase tracking-[0.25em] italic leading-none ${
                    activeTab === tab.id 
                    ? "bg-slate-950 text-white shadow-xl scale-105" 
                    : "text-slate-400 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-lg opacity-40">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
           </nav>

           <div className="mt-12 pt-8 border-t border-slate-100 px-2 space-y-4">
              <button 
                 onClick={logout}
                 className="w-full flex items-center justify-center gap-4 px-6 py-4 rounded-xl text-pink-600 hover:bg-pink-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-[0.4em] border border-pink-100 italic active:scale-95"
              >
                 Logout
              </button>
           </div>
        </div>
      </aside>

      {/* 🌙 MAIN MATRIX DISPLAY */}
      <main className="flex-1 space-y-16">
        
        <PageHeader 
          title={tabs.find(t => t.id === activeTab)?.label} 
          subtitle="Manage users, platform settings, and view growth reports through the central command panel."
          badge="Admin Mode: Online"
        />

        {error && (
           <div className="p-8 bg-pink-50 border border-pink-100 rounded-3xl text-pink-600 text-center text-[10px] font-black uppercase tracking-[0.4em] shadow-xl italic">
              {error}
           </div>
        )}

        {/* 🌙 DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-reveal">
             <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: "Total Users", value: metrics?.totalUsers || 0, icon: "👤", color: "text-indigo-600" },
                  { label: "Professionals", value: metrics?.totalProfessionals || 0, icon: "🎖️", color: "text-teal-600" },
                  { label: "Active Services", value: metrics?.totalServices || 0, icon: "📦", color: "text-amber-600" },
                  { label: "Net Revenue", value: `$${metrics?.totalRevenue || 0}`, icon: "💰", color: "text-emerald-700" }
                ].map((card, i) => (
                   <div key={i} className="premium-glass p-8 relative bg-white border border-slate-100 group shadow-xl rounded-[2rem] hover:border-indigo-500/30 transition-all">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic leading-none">{card.label}</p>
                      <h3 className={`text-5xl font-black ${card.color} tracking-tighter italic leading-none truncate`}>{card.value}</h3>
                   </div>
                ))}
             </div>
             
             <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 premium-glass p-16 flex flex-col justify-end min-h-[350px] relative overflow-hidden bg-white border-slate-100 shadow-2xl rounded-[3rem]">
                   <div className="relative z-10 space-y-8">
                      <div className="w-16 h-1.5 bg-slate-950 rounded-full"></div>
                      <div className="space-y-4">
                         <h3 className="bg-slate-950 text-white px-8 py-3 w-fit italic font-black uppercase text-sm tracking-[0.4em] rounded-xl shadow-xl">Platform Health</h3>
                         <p className="text-slate-500 text-xl font-bold uppercase tracking-tight max-w-sm leading-relaxed italic border-l-[3px] border-indigo-500/20 pl-8">
                           System synchronization is steady. Monitoring active nodes and transaction sequences across all sectors.
                         </p>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 grid gap-6">
                   <div className="premium-glass p-10 bg-white border-slate-100 shadow-xl rounded-[2.5rem] flex flex-col justify-center">
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 italic border-b border-indigo-50 pb-4">Performance Metrics</h4>
                      <div className="space-y-6">
                         {[
                           { label: "Platform Uptime", val: 99.9, color: "bg-indigo-600" },
                           { label: "Database Sync", val: 100, color: "bg-slate-950" },
                         ].map(stat => (
                            <div key={stat.label}>
                               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] mb-3 italic">
                                  <span className="text-slate-400">{stat.label}</span>
                                  <span className="text-slate-950 font-mono">{stat.val}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                  <div style={{ width: `${stat.val}%` }} className={`h-full ${stat.color} transition-all duration-[2s]`}></div>
                                </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* 🌙 REPORTS & ANALYSIS */}
        {activeTab === "reports" && reports && (
          <div className="space-y-12 animate-reveal">
             <div className="grid lg:grid-cols-2 gap-8">
                {/* User Mix Analysis */}
                <div className="premium-glass p-12 bg-white border-slate-100 shadow-2xl rounded-[3rem] space-y-10 group hover:border-indigo-500/20 transition-all">
                   <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-950 mb-2">User Distribution</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Current Personnel Architecture</p>
                   </div>
                   <div className="space-y-6">
                      {[
                        { label: "Clients", count: reports.usersByRole.user, icon: "👤", color: "bg-indigo-600" },
                        { label: "Professionals", count: reports.usersByRole.professional, icon: "🛠️", color: "bg-emerald-600" },
                        { label: "Admins", count: reports.usersByRole.admin, icon: "⚡", color: "bg-slate-950" }
                      ].map(row => {
                         const total = Object.values(reports.usersByRole).reduce((a, b) => a + b, 0);
                         const percent = Math.round((row.count / total) * 100) || 0;
                         return (
                            <div key={row.label} className="group/row">
                               <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center gap-4">
                                     <span className="text-lg opacity-40">{row.icon}</span>
                                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/row:text-slate-950 transition-colors uppercase">{row.label}</span>
                                  </div>
                                  <span className="text-sm font-black text-slate-950 italic">{row.count} Nodes ({percent}%)</span>
                               </div>
                               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                  <div className={`h-full ${row.color} transition-all duration-[1.5s]`} style={{ width: `${percent}%` }}></div>
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>

                {/* Hire Success Analytics */}
                <div className="premium-glass p-12 bg-white border-slate-100 shadow-2xl rounded-[3rem] space-y-10 group hover:border-indigo-500/20 transition-all">
                   <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-950 mb-2">Engagement Metrics</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Platform Project Status Breakdown</p>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      {Object.entries(reports.hiresByStatus || {}).map(([status, count]) => (
                         <div key={status} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center group/stat hover:bg-white transition-all shadow-inner">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">{status}</p>
                            <p className="text-4xl font-black text-slate-950 italic tracking-tighter leading-none group-hover/stat:text-indigo-600 transition-colors">{count}</p>
                         </div>
                      ))}
                   </div>
                   <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Project Completion Rate</p>
                      <p className="text-xl font-black text-emerald-600 italic">
                        {Math.round((reports.hiresByStatus.Completed / (Object.values(reports.hiresByStatus).reduce((a, b) => a + b, 0) || 1)) * 100)}%
                      </p>
                   </div>
                </div>
             </div>

             <div className="premium-glass p-16 bg-slate-950 text-white shadow-2xl rounded-[4rem] relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 border-[2px] border-white/5">
                <div className="absolute top-0 right-0 p-16 text-9xl opacity-[0.03] grayscale italic font-black uppercase rotate-6 pointer-events-none">STRATEGIC_INTEL</div>
                <div className="flex-1 space-y-6">
                   <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Net Platform Growth</h2>
                   <p className="text-slate-400 text-base font-bold uppercase tracking-tight max-w-lg leading-relaxed italic border-l-[3px] border-white/20 pl-8">
                     Analyzing user behavior patterns and connection success rates indicate a steady upward trend in professional-to-client conversions.
                   </p>
                </div>
                <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-[3rem] border border-white/10 shadow-inner min-w-[240px]">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">Total Transactions</p>
                   <p className="text-6xl font-black text-indigo-400 italic tracking-tighter">${reports.totalRevenue}</p>
                </div>
             </div>
          </div>
        )}

        {/* 🌙 USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-12 animate-reveal">
            <form onSubmit={handleCreateUser} className="premium-glass p-8 bg-white border-slate-100 flex flex-wrap lg:flex-nowrap gap-6 items-end shadow-xl rounded-[2.5rem] border-[2px]">
              <div className="flex-1 min-w-[200px] space-y-3">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic px-1">Name</label>
                 <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} placeholder="Subject Name" className="form-input py-4 bg-slate-50 border-slate-50 italic text-sm" required />
              </div>
              <div className="flex-1 min-w-[200px] space-y-3">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic px-1">Email</label>
                 <input value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} placeholder="email@address.com" className="form-input py-4 bg-slate-50 border-slate-50 italic text-sm" required />
              </div>
              <div className="flex-1 min-w-[150px] space-y-3">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic px-1">Password</label>
                 <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" className="form-input py-4 bg-slate-50 border-slate-50 text-sm" required />
              </div>
              <div className="flex-1 min-w-[150px] space-y-3">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic px-1">Role</label>
                 <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} className="form-input py-4 bg-slate-50 border-slate-50 text-[10px] font-black uppercase italic text-indigo-600 outline-none">
                    <option value="user">USER</option>
                    <option value="professional">PRO</option>
                    <option value="admin">ADMIN</option>
                 </select>
              </div>
              <button type="submit" disabled={isCreating} className="px-10 py-5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all italic h-[52px] disabled:opacity-50">
                 {isCreating ? "Inscribing..." : "Inscribe"}
              </button>
            </form>

            <div className="premium-glass overflow-hidden border-slate-100 bg-white shadow-2xl rounded-[3rem] border-[1.5px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] bg-slate-50/20 italic">
                        <th className="px-10 py-8">User Details</th>
                        <th className="px-10 py-8">Role</th>
                        <th className="px-10 py-8 text-center">Status</th>
                        <th className="px-10 py-8 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-2xl shadow-inner italic">{u.name?.[0]?.toUpperCase()}</div>
                              <div className="space-y-1 min-w-0">
                                 <p className="font-black text-xl italic uppercase tracking-tighter leading-none truncate">{u.name}</p>
                                 <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase leading-none truncate">{u.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] italic border ${u.role === 'admin' ? 'bg-slate-950 text-white border-slate-950' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{u.role}</span>
                        </td>
                        <td className="px-10 py-8 text-center">
                           <div className="flex flex-col items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_lime]' : 'bg-slate-200'}`}></div>
                             <span className="font-black text-[8px] text-slate-400 uppercase italic leading-none">{u.status}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-6">
                             <button onClick={() => toggleUserStatus(u)} className="text-[10px] font-black uppercase text-indigo-600 hover:text-slate-950 transition italic underline underline-offset-4 decoration-indigo-100">Toggle</button>
                             <button onClick={() => deleteUser(u.id).then(() => fetchUsers().then(setUsers))} className="text-[10px] font-black uppercase text-pink-600 hover:text-slate-950 transition italic underline underline-offset-4 decoration-pink-100">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 🌙 PLATFORM SETTINGS */}
        {activeTab === "settings" && (
           <div className="max-w-2xl animate-reveal">
              <div className="premium-glass p-12 space-y-12 bg-white border-slate-100 shadow-2xl rounded-[3.5rem] relative overflow-hidden border-[2px]">
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic px-2 border-l-[3px] border-indigo-600 pl-4">Platform Identity</label>
                       <input value={settings.platformName} onChange={(e) => setSettings((p) => ({ ...p, platformName: e.target.value }))} className="form-input text-4xl font-black italic bg-slate-50 border-slate-50 py-8 px-10 rounded-2xl shadow-inner focus:bg-white transition-all outline-none" />
                    </div>
                    <div className="space-y-6">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic px-2 border-l-[3px] border-slate-200 pl-4">Service Fee (%)</label>
                       <div className="relative group/rate max-w-[200px]">
                          <input type="number" value={settings.commissionRate} onChange={(e) => setSettings((p) => ({ ...p, commissionRate: Number(e.target.value) }))} className="form-input text-5xl font-black tracking-tight italic bg-slate-50 border-slate-50 py-10 px-12 rounded-2xl shadow-inner text-center focus:bg-white transition-all outline-none" />
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={async () => {
                     try {
                       setIsCreating(true);
                       await updatePlatformSettings(settings);
                       alert("System settings updated.");
                     } finally {
                       setIsCreating(false);
                     }
                   }} 
                   disabled={isCreating}
                   className="w-full btn-glow py-8 rounded-2xl shadow-xl active:scale-95 transition-all text-[10px] italic disabled:opacity-50"
                 >
                    {isCreating ? "Synchronizing..." : "Update Config"}
                 </button>
              </div>
           </div>
        )}

      </main>
    </div>
  );
}

export default AdminPanel;
