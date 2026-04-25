import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, FileText, X, AlertTriangle } from 'lucide-react';

const MAX = 5000;
const MIN = 50;

export default function JobDescriptionForm({ onAnalyze, loading }) {
  const [text, setText] = useState('');

  const pct    = (text.length / MAX) * 100;
  const near   = pct > 85;
  const atMax  = text.length >= MAX;
  const canSubmit = text.trim().length >= MIN && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface2)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(248,113,113,0.5)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(251,191,36,0.5)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(52,211,153,0.5)' }} />
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" style={{ color: 'var(--t4)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--t4)' }}>job_description.txt</span>
          </div>
        </div>
        {text && (
          <button
            onClick={() => setText('')}
            className="p-1 rounded-md transition-colors"
            style={{ color: 'var(--t5)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--t3)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t5)'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value.slice(0, MAX))}
        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit) onAnalyze(text.trim()); }}
        placeholder={`Paste the full job description here...\n\nInclude role title, responsibilities, requirements, and tech stack for the most accurate analysis.\n\nCtrl + Enter to analyze.`}
        disabled={loading}
        spellCheck={false}
        className="w-full outline-none resize-none font-body leading-7 p-5 min-h-[260px] md:min-h-[300px]"
        style={{ background: 'transparent', color: 'var(--t2)', fontSize: '13.5px' }}
      />

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-3 gap-4"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface2)' }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface3)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, pct)}%`,
                  background: atMax ? '#f87171' : near ? '#fbbf24' : 'var(--brand)',
                }}
              />
            </div>
            <span className="text-xs font-mono" style={{ color: atMax ? '#f87171' : near ? '#fbbf24' : 'var(--t5)' }}>
              {text.length}/{MAX}
            </span>
          </div>

          {text.trim().length > 0 && text.trim().length < MIN && (
            <span className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: '#f59e0b' }}>
              <AlertTriangle className="w-3 h-3" />
              {MIN - text.trim().length} more chars
            </span>
          )}

          <span className="hidden md:block text-xs font-mono" style={{ color: 'var(--t6)' }}>Ctrl+Enter</span>
        </div>

        <motion.button
          onClick={() => canSubmit && onAnalyze(text.trim())}
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.02 } : undefined}
          whileTap={canSubmit ? { scale: 0.97 } : undefined}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-sm shrink-0 text-white"
          style={{
            background: 'linear-gradient(135deg,var(--brand-light),var(--brand))',
            boxShadow: canSubmit ? '0 4px 16px var(--brand-glow)' : 'none',
            opacity: canSubmit ? 1 : 0.4,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</> : <><Send className="w-4 h-4" />Analyze JD</>}
        </motion.button>
      </div>
    </motion.div>
  );
}
