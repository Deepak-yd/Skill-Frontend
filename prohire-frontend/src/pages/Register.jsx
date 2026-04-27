import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";
import { useAuth } from "../context/useAuth";

function Register() {
  const { applySession } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register(formData);
      applySession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden px-4 py-20">
      
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-float delay-2000"></div>

      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-10 items-center relative z-10">
        
        <div className="hidden lg:flex flex-col space-y-8 animate-reveal">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Join ProHire</span>
           </div>
           
           <h1 className="text-6xl font-black italic tracking-tighter leading-none uppercase">
              Pro<span className="text-indigo-500">Hire</span> <br />
              Register
           </h1>
           
           <p className="text-slate-500 text-lg font-bold uppercase tracking-tight max-w-[380px] italic border-l-4 border-indigo-500/50 pl-8 leading-relaxed">
              Create your account to start hiring professionals or listing your own expertise.
           </p>
        </div>

        <div className="w-full max-w-[440px] mx-auto animate-reveal">
           <div className="glass-panel p-10 rounded-[3rem] relative group shadow-2xl">
              
              <div className="mb-10 text-center lg:text-left">
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-1">Sign Up</h2>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Join our professional community</p>
              </div>

              {error && (
                <div className="mb-8 p-5 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-500 text-[9px] font-black uppercase tracking-[0.3em] text-center shadow-lg animate-reveal">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="block text-[8.5px] font-black text-slate-700 uppercase tracking-[0.3em] italic px-1">Full Name</label>
                       <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="form-input w-full rounded-xl px-8 py-4 text-base font-black italic tracking-tight outline-none transition-all placeholder:opacity-50"
                          placeholder="e.g. Alex Johnson"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="block text-[8.5px] font-black text-slate-700 uppercase tracking-[0.3em] italic px-1">Email Address</label>
                       <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="form-input w-full rounded-xl px-8 py-4 text-base font-black italic tracking-tight outline-none transition-all placeholder:opacity-50"
                          placeholder="alex@example.com"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="block text-[8.5px] font-black text-slate-700 uppercase tracking-[0.3em] italic px-1">Password</label>
                       <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="form-input w-full rounded-xl px-8 py-4 text-base font-black italic tracking-tight outline-none transition-all placeholder:opacity-50"
                          placeholder="Minimum 8 characters"
                       />
                    </div>

                    <div className="space-y-4">
                       <p className="block text-[8.5px] font-black text-slate-700 uppercase tracking-[0.3em] italic px-1 leading-none">Choose Your Role</p>
                       <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'user', label: 'Client', icon: '👤' },
                            { id: 'professional', label: 'Pro', icon: '🛠️' }
                          ].map(r => (
                             <button
                                key={r.id}
                                type="button"
                                onClick={() => setFormData({...formData, role: r.id})}
                                className={`group p-4 rounded-xl text-[8.5px] font-black uppercase tracking-[0.25em] transition-all border italic shadow-inner flex flex-col items-center gap-1 ${formData.role === r.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl scale-105' : 'glass-panel opacity-60 hover:opacity-100 hover:text-indigo-500'}`}
                             >
                                <span className="text-xl opacity-40 group-hover:opacity-100 transition-opacity leading-none">{r.icon}</span>
                                {r.label}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-glow py-6 font-black uppercase tracking-[0.5em] text-[9px] shadow-xl active:scale-95 transition-all rounded-xl"
                 >
                    {loading ? "Registering..." : "Create Account"}
                 </button>
                 
                 <div className="text-center pt-6 border-t border-white/5">
                    <p className="text-[8.5px] font-black text-slate-600 uppercase tracking-[0.3em] italic mb-4">Already have an account?</p>
                    <Link to="/login" className="px-8 py-3 rounded-lg border border-white/5 hover:border-indigo-500 text-[8.5px] font-black text-indigo-400 uppercase tracking-[0.4em] hover:text-white transition-colors italic inline-block decoration-indigo-500/30">Sign In</Link>
                 </div>
              </form>
           </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
    </div>
  );
}

export default Register;
