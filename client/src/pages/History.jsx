import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistIcon, Clock, Building, ChevronRight, Trash2, Lock, Loader2, BarChart2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

function TimeAgo({ date }) {
  const d = Math.floor((Date.now() - new Date(date)) / 1000);
  if (d < 60)    return <span>Just now</span>;
  if (d < 3600)  return <span>{Math.floor(d/60)}m ago</span>;
  if (d < 86400) return <span>{Math.floor(d/3600)}h ago</span>;
  return <span>{new Date(date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>;
}

const lvlCls = { Junior:'badge-green', Mid:'badge-sky', Senior:'badge-amber', Lead:'badge-red', Staff:'badge-violet' };

const Empty = ({ icon: Icon, title, desc, children }) => (
  <div className="max-w-3xl mx-auto px-5 py-20 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background:'var(--brand-soft)', border:'1px solid var(--brand-border)' }}>
      <Icon className="w-7 h-7" style={{ color:'var(--t4)' }} />
    </div>
    <h2 className="font-display text-xl font-bold mb-2" style={{ color:'var(--t1)' }}>{title}</h2>
    <p className="text-sm mb-8 max-w-xs" style={{ color:'var(--t4)' }}>{desc}</p>
    {children}
  </div>
);

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { if (!user) { setLoading(false); return; } fetchHistory(); }, [user]);

  const fetchHistory = async () => {
    try { setLoading(true); const {data} = await api.get('/history?limit=20'); setAnalyses(data.data||[]); }
    catch(err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); setDeleting(id);
    try { await api.delete(`/history/${id}`); setAnalyses(p=>p.filter(a=>a._id!==id)); if(expanded===id) setExpanded(null); toast.success('Deleted'); }
    catch(err) { toast.error(err.message); } finally { setDeleting(null); }
  };

  if (!user) return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      <Empty icon={Lock} title="Sign in to view your history" desc="Your analyses are saved automatically when signed in.">
        <div className="flex gap-3">
          <button onClick={()=>navigate('/login')} className="btn-primary text-sm px-5 py-2.5">Sign In</button>
          <button onClick={()=>navigate('/register')} className="btn-ghost text-sm px-5 py-2.5">Create Account</button>
        </div>
      </Empty>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center gap-3 py-24" style={{ background:'var(--bg)', minHeight:'100vh', color:'var(--t4)' }}>
      <Loader2 className="w-5 h-5 animate-spin" /><span className="font-mono text-sm">Loading…</span>
    </div>
  );

  if (error) return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      <Empty icon={AlertCircle} title="Failed to load history" desc={error}>
        <button onClick={fetchHistory} className="text-sm font-medium transition-colors" style={{ color:'var(--brand-light)' }}>Try again</button>
      </Empty>
    </div>
  );

  if (!analyses.length) return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      <Empty icon={HistIcon} title="No analyses yet" desc="Your past job description analyses will appear here.">
        <button onClick={()=>navigate('/analyze')} className="btn-primary text-sm px-5 py-2.5">Analyze Your First JD</button>
      </Empty>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-10" style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="mb-7">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'var(--brand-soft)' }}>
            <HistIcon className="w-4 h-4" style={{ color:'var(--brand-light)' }} />
          </div>
          <h1 className="font-display text-xl font-bold" style={{ color:'var(--t1)' }}>Analysis History</h1>
        </div>
        <p className="text-[13px] ml-11" style={{ color:'var(--t4)' }}>
          {analyses.length} saved {analyses.length===1?'analysis':'analyses'}
        </p>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence>
          {analyses.map((a, i) => {
            const isOpen = expanded === a._id;
            const tops   = a.result?.skills?.technical?.slice(0,4) || [];
            return (
              <motion.div
                key={a._id}
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, height:0 }}
                transition={{ delay: i*0.04 }}
                className="rounded-xl overflow-hidden"
                style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', boxShadow:'var(--shadow-card)' }}
              >
                <button
                  onClick={() => setExpanded(isOpen?null:a._id)}
                  className="w-full flex items-center gap-4 p-4 text-left transition-colors"
                  onMouseEnter={e=>e.currentTarget.style.background='var(--brand-soft)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:'var(--brand-soft)' }}>
                    <BarChart2 className="w-5 h-5" style={{ color:'var(--brand-light)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-[14px]" style={{ color:'var(--t1)' }}>{a.role||'Software Engineer'}</p>
                      {a.experienceLevel && <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${lvlCls[a.experienceLevel]||'badge-slate'}`}>{a.experienceLevel}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {a.company && <span className="text-[12px] flex items-center gap-1" style={{ color:'var(--t4)' }}><Building className="w-3 h-3"/>{a.company}</span>}
                      <span className="text-[11px] font-mono flex items-center gap-1" style={{ color:'var(--t5)' }}><Clock className="w-2.5 h-2.5"/><TimeAgo date={a.createdAt}/></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e=>handleDelete(a._id,e)} disabled={deleting===a._id}
                      className="p-1.5 rounded-lg transition-all" style={{ color:'var(--t5)' }}
                      onMouseEnter={e=>{e.currentTarget.style.color='#f87171';e.currentTarget.style.background='rgba(248,113,113,0.08)';}}
                      onMouseLeave={e=>{e.currentTarget.style.color='var(--t5)';e.currentTarget.style.background='transparent';}}
                    >
                      {deleting===a._id ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Trash2 className="w-3.5 h-3.5"/>}
                    </button>
                    <ChevronRight className="w-4 h-4 transition-transform duration-200" style={{ color:'var(--t5)', transform:isOpen?'rotate(90deg)':'rotate(0deg)' }}/>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop:'1px solid var(--border)' }}>
                        {tops.length>0 && (
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color:'var(--t5)' }}>Top Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {tops.map(s => <span key={s} className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono badge-violet">{s}</span>)}
                              {(a.result?.skills?.technical?.length||0)>4 && <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono badge-slate">+{a.result.skills.technical.length-4} more</span>}
                            </div>
                          </div>
                        )}
                        <button onClick={()=>navigate('/analyze')} className="text-[12px] font-medium flex items-center gap-1 transition-colors" style={{ color:'var(--brand-light)' }}>
                          Re-analyze <ChevronRight className="w-3 h-3"/>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
