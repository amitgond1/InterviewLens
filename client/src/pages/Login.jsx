import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); if (error) setError(null); };
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError(null);
    try { await login(form.email.trim(), form.password); toast.success('Welcome back!'); navigate('/analyze'); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const inputCls = { width:'100%', padding:'10px 14px', borderRadius:'12px', background:'var(--bg-input)', border:'1px solid var(--border)', color:'var(--t1)', fontSize:'14px', fontFamily:'Inter,sans-serif', outline:'none', transition:'border-color 0.2s,box-shadow 0.2s' };
  const onFocus = e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-soft)'; };
  const onBlur  = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div
      className="min-h-screen gradient-mesh grid-overlay flex items-center justify-center px-5 py-12"
      style={{ background: 'var(--bg)' }}
    >
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">

        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
            style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow:'0 4px 14px var(--brand-glow)' }}>
            <Zap className="w-4.5 h-4.5 text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-[17px]" style={{ color: 'var(--t1)' }}>InterviewLens</span>
        </Link>

        <div className="p-7 rounded-2xl" style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', boxShadow:'var(--shadow-card)', backdropFilter:'blur(16px)' }}>
          <h2 className="font-display text-2xl font-bold mb-1.5" style={{ color:'var(--t1)' }}>Welcome back</h2>
          <p className="text-sm mb-7" style={{ color:'var(--t4)' }}>Sign in to access your saved analyses</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl flex items-center gap-2.5" style={{ background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.2)' }}>
              <AlertCircle className="w-4 h-4 shrink-0" style={{ color:'#f87171' }} />
              <p className="text-[13px]" style={{ color:'#f87171' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11.5px] font-mono uppercase tracking-wide mb-1.5" style={{ color:'var(--t4)' }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={inputCls} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="block text-[11.5px] font-mono uppercase tracking-wide mb-1.5" style={{ color:'var(--t4)' }}>Password</label>
              <div className="relative">
                <input type={showPw?'text':'password'} name="password" value={form.password} onChange={handleChange} placeholder="Your password" required style={{...inputCls,paddingRight:'44px'}} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors" style={{ color:'var(--t5)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={!loading?{scale:1.01}:undefined} whileTap={!loading?{scale:0.98}:undefined}
              className="w-full flex items-center justify-center gap-2 py-3 font-display font-bold text-[14px] rounded-xl text-white mt-6"
              style={{ background:'linear-gradient(135deg,var(--brand-light),var(--brand))', boxShadow:loading?'none':'0 4px 16px var(--brand-glow)', opacity:loading?0.6:1, cursor:loading?'not-allowed':'pointer' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <p className="text-center text-[13px] mt-6" style={{ color:'var(--t5)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium transition-colors" style={{ color:'var(--brand-light)' }}>Create one free</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link to="/analyze" className="text-[12px] transition-colors" style={{ color:'var(--t5)' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--t3)'} onMouseLeave={e=>e.currentTarget.style.color='var(--t5)'}>
            Continue without account →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
