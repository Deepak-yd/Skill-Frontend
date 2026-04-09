import { useState, useEffect } from "react";
import { fetchConnections, updateConnectionStatus, sendConnectionRequest, fetchAcceptedFriends } from "../api";
import PageHeader from "../components/PageHeader";
import ChatModal from "../components/ChatModal";

function Connections() {
  const [activeTab, setActiveTab] = useState("received");
  const [connections, setConnections] = useState({ sent: [], received: [] });
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [connData, friendsData] = await Promise.all([
        fetchConnections(),
        fetchAcceptedFriends()
      ]);
      setConnections(connData);
      setFriends(friendsData || []);
    } catch (err) {
      console.error("Sync failure.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateConnectionStatus(id, status);
      await loadData();
    } catch (err) { alert("Status update failed."); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await sendConnectionRequest(email);
      setEmail("");
      setMessage({ text: "Invitation sent.", type: "success" });
      await loadData();
    } catch (err) { setMessage({ text: err.message, type: "error" }); }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-reveal">
         <div className="w-10 h-10 border-[3px] border-white/5 border-t-indigo-600 rounded-full animate-spin"></div>
         <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em] animate-pulse italic">Neural Sync Active...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-reveal max-w-7xl mx-auto px-4">
      
      <PageHeader 
        title="Connections" 
        subtitle="Manage your ecosystem of professional peers and incoming sync requests."
        badge="Node_Status: Secured"
      >
        <div className="flex flex-col sm:flex-row gap-4 premium-glass p-2 border-white/10 shadow-2xl rounded-full border">
           <div className="flex gap-1 p-1 bg-white/5 rounded-full">
              {[
                { id: 'received', label: 'Requests', count: connections.received.length },
                { id: 'friends', label: 'Nodes', count: friends.length },
                { id: 'sent', label: 'Sent', count: connections.sent.length }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)} 
                  className={`px-8 py-2.5 rounded-full text-[8.5px] font-black uppercase tracking-[0.25em] italic transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-white'}`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
           </div>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
         
         <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-40">
            <div className="premium-glass p-10 bg-white/5 border-white/10 shadow-2xl rounded-[3rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 text-6xl opacity-[0.02] grayscale italic font-black uppercase leading-none pointer-events-none group-hover:opacity-[0.08] transition-opacity">LINK</div>
               <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-8 border-b border-white/5 pb-6">Invite Peer</h3>
               <form onSubmit={handleSend} className="space-y-6 relative z-10">
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none pl-4 border-l-2 border-indigo-500">Email Address</p>
                     <input 
                       value={email} onChange={(e) => setEmail(e.target.value)} 
                       placeholder="peer@prohire.io" 
                       className="input-premium w-full bg-slate-900/50 border-white/5 py-5 text-lg font-black italic shadow-inner" required 
                     />
                  </div>
                  <button type="submit" className="w-full py-5 bg-white text-slate-950 hover:bg-indigo-600 hover:text-white rounded-2xl shadow-xl transition-all font-black text-[9px] uppercase tracking-[0.4em] italic active:scale-95">Transmit Sync</button>
               </form>
               {message && (
                 <div className={`mt-8 p-5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] border italic text-center animate-reveal ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-pink-500/10 text-pink-500 border-pink-500/20'}`}>
                    {message.text}
                 </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-8 border-l-[3px] border-indigo-600 mb-6">
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.6em] italic leading-none opacity-40">
                      {activeTab === 'received' ? 'Incoming Signals' : activeTab === 'friends' ? 'Synchronized Nodes' : 'Outbound Transmissions'}
                    </h3>
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Ecosystem Grid View</p>
                </div>
            </div>

            <div className="space-y-6">
               {(activeTab === 'friends' ? friends : (activeTab === 'received' ? connections.received : connections.sent)).length === 0 ? (
                 <div className="premium-glass py-32 bg-white/2 flex flex-col items-center justify-center text-center rounded-[4rem] border-dashed border-white/5 border-2">
                    <p className="text-xl font-black text-slate-600 italic uppercase tracking-tighter opacity-50">Empty Sector</p>
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mt-4 italic">No active data points in this quadrant.</p>
                 </div>
               ) : (
                 (activeTab === 'friends' ? friends : (activeTab === 'received' ? connections.received : connections.sent)).map((item) => {
                    const u = activeTab === 'friends' ? item : (activeTab === 'received' ? item.requester : item.receiver);
                    return (
                      <div key={item.id || item.email} className="premium-glass p-8 bg-white/5 border-white/5 group relative overflow-hidden shadow-2xl rounded-[3rem] hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row items-center justify-between gap-10">
                         <div className="absolute top-0 right-0 p-10 text-5xl opacity-[0.015] grayscale pointer-events-none italic font-black uppercase leading-none group-hover:opacity-[0.05]">NODE_{u?.id || '?' }</div>
                         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>

                         <div className="flex items-center gap-8 relative z-10 w-full sm:w-auto">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl font-black italic shadow-inner text-indigo-400 group-hover:rotate-12 transition-all">
                              {u?.name?.[0]?.toUpperCase() || u?.email?.[0]?.toUpperCase() || 'P'}
                            </div>
                            <div className="space-y-2.5 flex-1 min-w-0">
                               <div className="flex flex-wrap items-center gap-4">
                                  <h4 className="text-2xl font-black tracking-tighter uppercase italic leading-none truncate pr-4">{u?.name || u?.email?.split('@')[0]}</h4>
                                  <span className="px-4 py-1 bg-white/5 border border-white/10 text-[8px] font-black text-indigo-500/50 uppercase tracking-[0.2em] rounded-lg italic">{u?.role?.toUpperCase()}</span>
                               </div>
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full animate-pulse ${activeTab === 'friends' ? 'bg-emerald-500 shadow-[0_0_8px_lime]' : 'bg-amber-500 shadow-[0_0_8px_orange]'}`}></div>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic truncate max-w-[200px]">{u?.email}</p>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto justify-end">
                            {activeTab === 'received' ? (
                               <>
                                  <button onClick={() => handleStatus(item.id, 'accepted')} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-white hover:text-slate-950 transition-all italic active:scale-95 leading-none">Accept</button>
                                  <button onClick={() => handleStatus(item.id, 'rejected')} className="px-8 py-4 bg-white/5 text-slate-500 hover:text-pink-500 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] transition-all italic active:scale-95 leading-none">Reject</button>
                               </>
                            ) : activeTab === 'sent' ? (
                               <div className="flex flex-col items-end gap-2">
                                  <span className="text-[10px] font-black text-indigo-500/30 uppercase tracking-[0.6em] italic pr-4">SYNC_PENDING</span>
                                  <button onClick={() => handleStatus(item.id, 'rejected')} className="text-[8px] font-black text-pink-600/50 hover:text-pink-500 uppercase tracking-[0.3em] italic transition-colors">Withdraw Request</button>
                               </div>
                            ) : (
                               <button 
                                 onClick={() => setSelectedRecipient(u)}
                                 className="px-12 py-4 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] shadow-xl transition-all italic active:scale-95 leading-none"
                               >
                                 Open Channel
                               </button>
                            )}
                         </div>
                      </div>
                    );
                 })
               )}
            </div>
         </div>

      </div>

      {selectedRecipient && (
        <ChatModal 
          recipient={selectedRecipient} 
          onClose={() => setSelectedRecipient(null)} 
        />
      )}

    </div>
  );
}

export default Connections;
