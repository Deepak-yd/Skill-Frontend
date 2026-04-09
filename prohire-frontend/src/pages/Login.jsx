import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../context/useAuth";

function Login() {
  const { applySession } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(formData);
      applySession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Identity recall failed. Neural link severed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side: Simplified Branding */}
        <div className="hidden lg:flex flex-col space-y-6 animate-reveal">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Secure Access</span>
           </div>
           
           <h1 className="text-6xl font-black text-white italic tracking-tighter leading-none uppercase">
              Pro<span className="text-indigo-500">Hire</span> <br />
              Login
           </h1>
           
           <p className="text-slate-500 text-lg font-bold uppercase tracking-tight max-w-[320px] italic border-l-2 border-indigo-500/50 pl-6">
              Sign in to manage your professional tasks and connections.
           </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-[380px] mx-auto animate-reveal">
           <div className="premium-glass p-8 rounded-[2.5rem] relative group border border-white/10 shadow-2xl">
              <div className="mb-8 text-center lg:text-left">
                 <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-1">Sign In</h2>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Access your account</p>
              </div>

              {error && (
                <div className="mb-6 mx-2 p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-500 text-[9px] font-black uppercase tracking-widest text-center animate-reveal">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="block text-[8.5px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 italic">Email Address</label>
                       <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-premium w-full bg-white/5 border-white/5 rounded-xl px-6 py-4 text-sm font-black italic tracking-tight focus:ring-2 ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800"
                          placeholder="e.g. alex@prohire.com"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[8.5px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 italic">Password</label>
                       <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="input-premium w-full bg-white/5 border-white/5 rounded-xl px-6 py-4 text-sm font-black italic tracking-tight focus:ring-2 ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800"
                          placeholder="••••••••"
                       />
                    </div>
                 </div>

                 <div className="flex items-center justify-between px-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                       <div className="w-3.5 h-3.5 rounded-md border border-white/10 group-hover:border-indigo-500 transition-all flex items-center justify-center overflow-hidden">
                          <div className="w-2 h-2 bg-indigo-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       </div>
                       <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-[0.25em] italic">Remember Me</span>
                    </label>
                    <button type="button" className="text-[8.5px] font-black text-indigo-500/60 hover:text-indigo-400 uppercase tracking-[0.25em] italic transition-colors">Forgot Password?</button>
                 </div>

                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden group/btn"
                 >
                    <div className="relative px-6 py-4 rounded-xl bg-white text-slate-950 font-black uppercase tracking-[0.4em] text-[9px] italic shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white">
                       {loading ? (
                         <>
                           <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                           <span>Signing in...</span>
                         </>
                       ) : (
                         "Sign In"
                       )}
                    </div>
                 </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                 <p className="text-[8.5px] font-black text-slate-600 uppercase tracking-[0.3em] italic mb-4">Don't have an account?</p>
                 <Link to="/register" className="inline-block px-8 py-3 rounded-lg border border-white/5 hover:border-indigo-500 text-[8.5px] font-black text-white uppercase tracking-[0.4em] italic transition-all hover:bg-indigo-600/5">
                    Create Account
                 </Link>
              </div>
           </div>
        </div>

      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-20 opacity-10 pointer-events-none">
         {[...Array(4)].map((_, i) => (
           <div key={i} className="text-[10px] font-black uppercase tracking-[1em] text-white">SYSTEM_ID_00{i+1}</div>
         ))}
      </div>
    </div>
  );
}

export default Login;
