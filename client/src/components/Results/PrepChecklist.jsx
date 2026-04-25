import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, Clock, Layers, ChevronDown } from 'lucide-react';

const priCfg = {
  High:   { cls: 'badge-red',   label: 'High'   },
  Medium: { cls: 'badge-amber', label: 'Medium' },
  Low:    { cls: 'badge-green', label: 'Low'    },
};
const CAT = ['DSA', 'System Design', 'Tech Stack', 'Behavioral', 'Projects', 'Research'];

export default function PrepChecklist({ items, systemDesign }) {
  const [checked, setChecked]   = useState({});
  const [showSD, setShowSD]     = useState(false);

  const total   = items?.length || 0;
  const done    = Object.values(checked).filter(Boolean).length;
  const pct     = total > 0 ? (done / total) * 100 : 0;
  const totalH  = items?.reduce((s, x) => s + (x.estimatedHours || 0), 0) || 0;
  const leftH   = items?.reduce((s, x, i) => s + (!checked[i] ? x.estimatedHours || 0 : 0), 0) || 0;

  const grouped = {};
  items?.forEach((it, i) => { const c = it.category || 'Other'; if (!grouped[c]) grouped[c] = []; grouped[c].push({ ...it, index: i }); });
  const cats = [...CAT.filter(c => grouped[c]), ...Object.keys(grouped).filter(c => !CAT.includes(c))];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 card">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft)' }}>
            <CheckSquare className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
          </div>
          <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--t1)' }}>Prep Checklist</h3>
        </div>
        <span className="text-sm font-mono" style={{ color: done === total && total > 0 ? '#34d399' : 'var(--t4)' }}>
          {done}/{total}{done === total && total > 0 ? ' ✓' : ''}
        </span>
      </div>

      <p className="text-[11px] font-mono ml-11 mb-4 flex items-center gap-1" style={{ color: 'var(--t6)' }}>
        <Clock className="w-3 h-3" />{leftH}h remaining · {totalH}h total
      </p>

      <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--bg-surface3)' }}>
        <motion.div
          animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: pct === 100 ? '#34d399' : 'linear-gradient(90deg,var(--brand-light),#38bdf8)' }}
        />
      </div>

      <div className="space-y-5">
        {cats.map(cat => (
          <div key={cat}>
            <p className="text-[10.5px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: 'var(--t6)' }}>
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: 'var(--t6)' }} />{cat}
            </p>
            <div className="space-y-1">
              {grouped[cat]?.map(item => (
                <div
                  key={item.index}
                  onClick={() => setChecked(p => ({ ...p, [item.index]: !p[item.index] }))}
                  className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {checked[item.index]
                    ? <CheckSquare className="w-4.5 h-4.5 shrink-0 mt-0.5" style={{ color: 'var(--brand-light)' }} />
                    : <Square     className="w-4.5 h-4.5 shrink-0 mt-0.5 transition-colors" style={{ color: 'var(--t6)' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] leading-snug transition-all"
                      style={{ color: checked[item.index] ? 'var(--t5)' : 'var(--t1)', textDecoration: checked[item.index] ? 'line-through' : 'none' }}
                    >
                      {item.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${(priCfg[item.priority] || priCfg.Medium).cls}`}>
                        {(priCfg[item.priority] || priCfg.Medium).label}
                      </span>
                      {item.estimatedHours > 0 && (
                        <span className="text-[10.5px] font-mono flex items-center gap-1" style={{ color: 'var(--t5)' }}>
                          <Clock className="w-2.5 h-2.5" />{item.estimatedHours}h
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {systemDesign?.length > 0 && (
        <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setShowSD(v => !v)}
            className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider mb-3 w-full transition-colors"
            style={{ color: showSD ? 'var(--brand-light)' : 'var(--t5)' }}
          >
            <Layers className="w-3.5 h-3.5" />System Design Topics
            <span className="ml-auto" style={{ color: 'var(--t6)' }}>({systemDesign.length})</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform" style={{ transform: showSD ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>
          <AnimatePresence initial={false}>
            {showSD && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }} className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-1">
                  {systemDesign.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full text-[11px] font-mono badge-slate">{t}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
