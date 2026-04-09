import { useState, useEffect, useRef } from "react";
import { fetchMessages, sendMessage, getCurrentUser } from "../api";

function ChatModal({ recipient, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef(null);

  const loadData = async () => {
    try {
      const [msgs, me] = await Promise.all([
        fetchMessages(recipient.id),
        getCurrentUser()
      ]);
      setMessages(msgs);
      setCurrentUser(me);
    } catch (err) {
      console.error("Chat frequency disrupted.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [recipient.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sent = await sendMessage(recipient.id, newMessage);
      setMessages([...messages, { ...sent, sender: currentUser }]);
      setNewMessage("");
    } catch (err) {
      alert("Transmission failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-reveal">
      <div className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-xl">
                 {recipient.name?.[0] || recipient.email?.[0] || 'P'}
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black italic uppercase tracking-tighter shimmer-text">{recipient.name || recipient.email}</h3>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_lime]"></span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Encryption_Active</span>
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
           {isLoading ? (
             <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-[2px] border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
             </div>
           ) : messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <p className="text-6xl font-black italic uppercase italic">Void</p>
                <p className="text-[9px] font-black uppercase tracking-[0.6em] mt-4">Start the conversation</p>
             </div>
           ) : (
             messages.map((msg, i) => {
               const isMe = msg.senderId === currentUser?.id;
               return (
                 <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-reveal`}>
                    <div className={`max-w-[80%] space-y-2`}>
                       <div className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-2xl ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'}`}>
                          {msg.content}
                       </div>
                       <p className={`text-[8px] font-black uppercase tracking-widest opacity-20 ${isMe ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                 </div>
               );
             })
           )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-8 border-t border-white/5 bg-white/2 flex gap-4">
           <input 
             value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
             placeholder="Encode message..."
             className="flex-1 bg-white/5 border-white/5 rounded-2xl px-6 py-4 text-sm font-bold italic focus:ring-2 ring-indigo-500/20 transition-all outline-none"
           />
           <button type="submit" className="px-8 py-4 bg-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] italic shadow-xl hover:bg-slate-950 transition-all active:scale-95">
              Send
           </button>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;
