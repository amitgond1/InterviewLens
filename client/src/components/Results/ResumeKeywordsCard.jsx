import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Copy, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeKeywordsCard({ keywords, tips }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab]  = useState('keywords');

  if (!keywords?.length && !tips?.length) return null;

  const copyAll = async () => {
    await navigator.clipboard.writeText(keywords.join(', '));
    setCopiedAll(true);
    toast.success('All keywords copied!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const tipCatColor = {
    Technical:         'badge-violet',
    Behavioral:        'badge-sky',
    'Company Research':'badge-amber',
    Preparation:       'badge-green',
    Mindset:           'badge-indigo',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft)' }}>
            <FileSearch className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
          </div>
          <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--t1)' }}>Resume & Interview Tips</h3>
        </div>
        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {['keywords', 'tips'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 text-[11.5px] font-mono capitalize transition-colors"
              style={{
                background: activeTab === tab ? 'var(--brand-soft)' : 'transparent',
                color: activeTab === tab ? 'var(--brand-light)' : 'var(--t4)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'keywords' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--t5)' }}>
              ATS-Optimized Keywords · paste into your resume
            </p>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 text-[11.5px] font-medium transition-colors"
              style={{ color: copiedAll ? '#34d399' : 'var(--brand-light)' }}
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <motion.span
                key={kw}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="px-3 py-1 rounded-full text-[11.5px] font-mono cursor-pointer badge-slate transition-all"
                onClick={async () => {
                  await navigator.clipboard.writeText(kw);
                  toast.success(`"${kw}" copied`, { duration: 1200 });
                }}
                title="Click to copy"
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.color = 'var(--brand-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
              >
                {kw}
              </motion.span>
            ))}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: 'var(--t5)' }}>
            💡 Click any keyword to copy it individually
          </p>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-3">
          {tips?.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-3.5 rounded-xl"
              style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'var(--brand-soft)' }}
              >
                <Sparkles className="w-3 h-3" style={{ color: 'var(--brand-light)' }} />
              </div>
              <div>
                <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded-full mb-1.5 inline-block ${tipCatColor[t.category] || 'badge-violet'}`}>
                  {t.category}
                </span>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t2)' }}>{t.tip}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
