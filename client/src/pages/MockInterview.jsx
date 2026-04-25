import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, ChevronLeft, ChevronRight, RotateCcw,
  CheckCircle2, XCircle, Eye, EyeOff, Zap,
  BarChart2, Search, Code, MessageSquare, Trophy
} from 'lucide-react';
import DifficultyTag from '../components/UI/DifficultyTag';

function buildDeck(analysis) {
  const deck = [];
  analysis.dsaQuestions?.forEach((q, i) => {
    deck.push({ id: `dsa-${i}`, type: 'DSA', question: q.question, topic: q.topic, difficulty: q.difficulty, back: q.hint || 'Think about the optimal time complexity first.', meta: q.leetcode_similar });
  });
  analysis.behavioralQuestions?.forEach((q, i) => {
    deck.push({ id: `beh-${i}`, type: 'Behavioral', question: q.question, category: q.category, back: q.starTip || 'Use the STAR format: Situation, Task, Action, Result.', difficulty: null });
  });
  return deck;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MockInterview() {
  const navigate = useNavigate();
  const [analysis, setAnalysis]   = useState(null);
  const [deck,     setDeck]       = useState([]);
  const [filter,   setFilter]     = useState('All');
  const [idx,      setIdx]        = useState(0);
  const [flipped,  setFlipped]    = useState(false);
  const [ratings,  setRatings]    = useState({});  // id → 'got' | 'miss'
  const [done,     setDone]       = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('il-last-analysis');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnalysis(parsed);
        const full = buildDeck(parsed);
        setDeck(shuffle(full));
      }
    } catch { /* ignore */ }
  }, []);

  const filtered = deck.filter(c => filter === 'All' || c.type === filter);
  const card     = filtered[idx];
  const total    = filtered.length;

  const gotCount  = Object.values(ratings).filter(v => v === 'got').length;
  const missCount = Object.values(ratings).filter(v => v === 'miss').length;
  const pct       = total > 0 ? Math.round(((gotCount + missCount) / total) * 100) : 0;

  const next  = () => { setFlipped(false); setTimeout(() => setIdx(i => Math.min(i + 1, total - 1)), 100); };
  const prev  = () => { setFlipped(false); setTimeout(() => setIdx(i => Math.max(i - 1, 0)), 100); };

  const rate = (val) => {
    if (!card) return;
    setRatings(r => ({ ...r, [card.id]: val }));
    if (idx >= total - 1) { setDone(true); } else { next(); }
  };

  const restart = () => {
    setIdx(0); setFlipped(false); setRatings({}); setDone(false);
    setDeck(d => shuffle([...d]));
  };

  const changeFilter = (f) => {
    setFilter(f); setIdx(0); setFlipped(false); setDone(false);
  };

  if (!analysis) return (
    <div className="max-w-2xl mx-auto px-5 py-20 flex flex-col items-center text-center" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--brand-soft)', border: '1px solid var(--brand-border)' }}>
        <Brain className="w-8 h-8" style={{ color: 'var(--brand-light)' }} />
      </div>
      <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--t1)' }}>No analysis loaded</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--t4)' }}>Analyze a job description first to start mock interview practice.</p>
      <button onClick={() => navigate('/analyze')} className="btn-primary">
        <Search className="w-4 h-4" />Analyze a Job Description
      </button>
    </div>
  );

  if (done || (total > 0 && gotCount + missCount === total)) return (
    <div className="max-w-2xl mx-auto px-5 py-16 flex flex-col items-center text-center" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.5 }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--brand-soft)', border: '2px solid var(--brand-border)' }}>
          <Trophy className="w-9 h-9" style={{ color: 'var(--brand-light)' }} />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--t1)' }}>Session Complete!</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--t4)' }}>You went through all {total} questions</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm mx-auto">
          {[
            { label: 'Mastered', value: gotCount,  color: '#34d399' },
            { label: 'Review',   value: missCount, color: '#f87171' },
            { label: 'Score',    value: `${total ? Math.round(gotCount/total*100) : 0}%`, color: 'var(--brand-light)' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] font-mono mt-1" style={{ color: 'var(--t4)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="btn-primary"><RotateCcw className="w-4 h-4" />Practice Again</button>
          <button onClick={() => navigate('/analyze')} className="btn-ghost">New Analysis</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:px-6 md:py-10" style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft)' }}>
            <Brain className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
          </div>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--t1)' }}>Mock Interview</h1>
          <span className="ml-auto text-[11px] font-mono px-2.5 py-1 rounded-lg badge-violet">
            {analysis.role || 'Practice'}
          </span>
        </div>
        <p className="text-[13px] ml-11" style={{ color: 'var(--t4)' }}>Flip each card to reveal hints · mark as mastered or needs review</p>
      </motion.div>

      {/* Filter + stats bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {['All', 'DSA', 'Behavioral'].map(f => (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-mono transition-all"
              style={{
                background: filter === f ? 'var(--brand-soft)' : 'var(--bg-surface2)',
                border: `1px solid ${filter === f ? 'var(--brand-border)' : 'var(--border)'}`,
                color: filter === f ? 'var(--brand-light)' : 'var(--t4)',
              }}
            >
              {f === 'DSA' ? <Code className="w-3 h-3" /> : f === 'Behavioral' ? <MessageSquare className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--t5)' }}>
          <span style={{ color: '#34d399' }}>✓ {gotCount}</span>
          <span style={{ color: '#f87171' }}>✗ {missCount}</span>
          <span>{idx + 1}/{total}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--bg-surface3)' }}>
        <motion.div
          animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,var(--brand-light),#34d399)' }}
        />
      </div>

      {/* Card */}
      {card && (
        <div className="mb-6" style={{ perspective: '1200px' }}>
          <motion.div
            key={card.id + filter}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ transformStyle: 'preserve-3d', position: 'relative', height: '300px', cursor: 'pointer' }}
            onClick={() => setFlipped(f => !f)}
          >
            {/* Front */}
            <motion.div
              animate={{ rotateY: flipped ? -180 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                position: 'absolute', inset: 0, borderRadius: '20px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex', flexDirection: 'column', padding: '24px',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {card.type === 'DSA'
                    ? <><DifficultyTag difficulty={card.difficulty} /><span className="text-[11px] font-mono badge-slate px-2.5 py-0.5 rounded-full">{card.topic}</span></>
                    : <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${{Leadership:'badge-amber','Conflict Resolution':'badge-red',Achievement:'badge-green',Teamwork:'badge-sky','Problem Solving':'badge-violet',Adaptability:'badge-indigo',Communication:'badge-rose'}[card.category]||'badge-violet'}`}>{card.category}</span>
                  }
                </div>
                <span className="text-[10px] font-mono" style={{ color: 'var(--t5)' }}>{card.type}</span>
              </div>

              <p className="flex-1 text-[15px] font-medium leading-relaxed" style={{ color: 'var(--t1)' }}>
                {card.question}
              </p>

              <div className="flex items-center gap-2 mt-4" style={{ color: 'var(--t5)' }}>
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11.5px] font-mono">Click to reveal {card.type === 'DSA' ? 'hint' : 'STAR tip'}</span>
              </div>
            </motion.div>

            {/* Back */}
            <motion.div
              animate={{ rotateY: flipped ? 0 : 180 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                position: 'absolute', inset: 0, borderRadius: '20px',
                background: 'var(--brand-soft)',
                border: '1px solid var(--brand-border)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex', flexDirection: 'column', padding: '24px',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                {card.type === 'DSA' ? <Zap className="w-4 h-4" style={{ color: 'var(--brand-light)' }} /> : <Brain className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />}
                <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--brand)' }}>
                  {card.type === 'DSA' ? 'Approach Hint' : 'STAR Tip'}
                </span>
              </div>
              <p className="flex-1 text-[14px] leading-relaxed" style={{ color: 'var(--t1)' }}>{card.back}</p>
              {card.meta && (
                <p className="mt-3 text-[12px] font-mono" style={{ color: 'var(--t4)' }}>
                  Similar: {card.meta}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4" style={{ color: 'var(--t5)' }}>
                <EyeOff className="w-3.5 h-3.5" />
                <span className="text-[11.5px] font-mono">Click to flip back</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Action buttons */}
      {flipped && card && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-6"
        >
          <button
            onClick={() => rate('miss')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold text-[14px] transition-all"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
          >
            <XCircle className="w-4 h-4" />Need Review
          </button>
          <button
            onClick={() => rate('got')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold text-[14px] transition-all"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(52,211,153,0.1)'}
          >
            <CheckCircle2 className="w-4 h-4" />Got It!
          </button>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev} disabled={idx === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all btn-ghost"
          style={{ opacity: idx === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft className="w-4 h-4" />Previous
        </button>

        <button onClick={restart} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--t5)' }}
          title="Shuffle & restart"
          onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-light)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--t5)'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={next} disabled={idx >= total - 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all btn-ghost"
          style={{ opacity: idx >= total - 1 ? 0.4 : 1 }}
        >
          Next<ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
