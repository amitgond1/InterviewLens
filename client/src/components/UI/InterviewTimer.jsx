import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, X, ChevronUp } from 'lucide-react';

const PRESETS = [
  { label: '2m',  secs: 120  },
  { label: '5m',  secs: 300  },
  { label: '10m', secs: 600  },
  { label: '15m', secs: 900  },
];

function fmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;
}

export default function InterviewTimer() {
  const [open,      setOpen]      = useState(false);
  const [total,     setTotal]     = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running,   setRunning]   = useState(false);
  const [finished,  setFinished]  = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const setPreset = (secs) => {
    setRunning(false);
    setFinished(false);
    setTotal(secs);
    setRemaining(secs);
  };

  const toggle = () => { setRunning(r => !r); setFinished(false); };

  const reset = () => { setRunning(false); setFinished(false); setRemaining(total); };

  const pct = ((total - remaining) / total) * 100;
  const isLow = remaining <= 30 && remaining > 0;

  const strokeDash = 2 * Math.PI * 20;
  const strokeOffset = strokeDash * (1 - (total - remaining) / total);

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.2, ease: 'backOut' }}
            className="mb-3 rounded-2xl p-4 w-56"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-hover)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--t4)' }}>Interview Timer</span>
              <button onClick={() => setOpen(false)} style={{ color: 'var(--t5)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ring + time */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-24 h-24">
                <svg className="absolute inset-0 -rotate-90" width="96" height="96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="var(--bg-surface3)" strokeWidth="6" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke={finished ? '#f87171' : isLow ? '#fbbf24' : 'var(--brand)'}
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${(2 * Math.PI * 40) * (1 - (total - remaining) / total)}`}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-mono font-bold text-xl tabular-nums"
                    style={{ color: finished ? '#f87171' : isLow ? '#fbbf24' : 'var(--t1)' }}
                  >
                    {fmt(remaining)}
                  </span>
                  {finished && <span className="text-[9px] font-mono" style={{ color: '#f87171' }}>TIME UP</span>}
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setPreset(p.secs)}
                  className="text-[11px] font-mono py-1.5 rounded-lg transition-all"
                  style={{
                    background: total === p.secs ? 'var(--brand-soft)' : 'var(--bg-surface2)',
                    border: `1px solid ${total === p.secs ? 'var(--brand-border)' : 'var(--border)'}`,
                    color: total === p.secs ? 'var(--brand-light)' : 'var(--t4)',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={toggle}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-medium text-[13px] text-white transition-all"
                style={{ background: 'linear-gradient(135deg,var(--brand-light),var(--brand))', boxShadow: '0 2px 10px var(--brand-glow)' }}
              >
                {running ? <><Pause className="w-3.5 h-3.5" />Pause</> : <><Play className="w-3.5 h-3.5" />Start</>}
              </button>
              <button
                onClick={reset}
                className="p-2 rounded-xl transition-colors"
                style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)', color: 'var(--t4)' }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-[13px] text-white shadow-lg"
        style={{
          background: running
            ? 'linear-gradient(135deg,#f59e0b,#d97706)'
            : finished
            ? 'linear-gradient(135deg,#f87171,#ef4444)'
            : 'linear-gradient(135deg,var(--brand-light),var(--brand))',
          boxShadow: `0 4px 20px ${running ? 'rgba(245,158,11,0.4)' : 'var(--brand-glow)'}`,
        }}
      >
        <Timer className="w-4 h-4" />
        {running ? fmt(remaining) : finished ? 'Done!' : 'Timer'}
        <ChevronUp className="w-3.5 h-3.5" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </motion.button>
    </div>
  );
}
