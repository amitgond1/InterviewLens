import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ChevronDown, Lightbulb, ExternalLink, StickyNote } from 'lucide-react';
import DifficultyTag from '../UI/DifficultyTag';
import CopyButton from '../UI/CopyButton';

const DIFFS = ['All', 'Easy', 'Medium', 'Hard'];

function getNotes() {
  try { return JSON.parse(localStorage.getItem('il-dsa-notes') || '{}'); } catch { return {}; }
}
function saveNotes(notes) {
  localStorage.setItem('il-dsa-notes', JSON.stringify(notes));
}

export default function DSAQuestionsCard({ questions }) {
  const [expanded, setExpanded]   = useState(null);
  const [filter,   setFilter]     = useState('All');
  const [notes,    setNotes]      = useState(getNotes);
  const [noteOpen, setNoteOpen]   = useState({});

  const toggle = i => setExpanded(expanded === i ? null : i);

  const filtered = questions?.filter(q => filter === 'All' || q.difficulty === filter) || [];

  const counts = DIFFS.slice(1).reduce((acc, d) => {
    acc[d] = questions?.filter(q => q.difficulty === d).length || 0;
    return acc;
  }, {});

  const handleNote = (key, val) => {
    const updated = { ...notes, [key]: val };
    setNotes(updated);
    saveNotes(updated);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft)' }}>
            <Code className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
          </div>
          <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--t1)' }}>DSA Questions</h3>
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--t5)' }}>{questions?.length} total</span>
      </div>

      {/* Difficulty filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {DIFFS.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className="px-3 py-1 rounded-full text-[11.5px] font-mono transition-all"
            style={{
              background: filter === d ? 'var(--brand-soft)' : 'var(--bg-surface2)',
              border: `1px solid ${filter === d ? 'var(--brand-border)' : 'var(--border)'}`,
              color: filter === d ? 'var(--brand-light)' : 'var(--t4)',
            }}
          >
            {d}{d !== 'All' && counts[d] ? ` (${counts[d]})` : ''}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((q, i) => {
          const key = q.question.slice(0, 40);
          return (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {/* Row */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 p-4 text-left group"
                style={{ background: expanded === i ? 'var(--brand-soft)' : 'transparent' }}
              >
                <span className="font-mono text-[11px] w-6 shrink-0" style={{ color: expanded === i ? 'var(--brand)' : 'var(--t6)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[13.5px] font-medium leading-snug" style={{ color: 'var(--t2)' }}>
                  {q.question}
                </span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {notes[key] && <StickyNote className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />}
                  <DifficultyTag difficulty={q.difficulty} />
                  <ChevronDown
                    className="w-4 h-4 transition-all duration-200"
                    style={{ color: expanded === i ? 'var(--brand)' : 'var(--t5)', transform: expanded === i ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expanded === i && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg badge-slate">{q.topic}</span>
                        {q.leetcode_similar && (
                          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg badge-slate flex items-center gap-1">
                            <ExternalLink className="w-2.5 h-2.5" />{q.leetcode_similar}
                          </span>
                        )}
                      </div>

                      {q.hint && (
                        <div className="p-3.5 rounded-xl" style={{ background: 'var(--brand-soft)', border: '1px solid var(--brand-border)' }}>
                          <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--brand)' }}>
                            <Lightbulb className="w-3 h-3" />Approach Hint
                          </p>
                          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t2)' }}>{q.hint}</p>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <button
                          onClick={() => setNoteOpen(p => ({ ...p, [i]: !p[i] }))}
                          className="flex items-center gap-1.5 text-[11.5px] font-medium mb-1.5 transition-colors"
                          style={{ color: noteOpen[i] ? 'var(--brand-light)' : 'var(--t5)' }}
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                          {noteOpen[i] ? 'Hide notes' : notes[key] ? 'Edit note' : 'Add note'}
                        </button>
                        {noteOpen[i] && (
                          <textarea
                            value={notes[key] || ''}
                            onChange={e => handleNote(key, e.target.value)}
                            placeholder="Add your notes, approach, or solution here..."
                            rows={3}
                            className="w-full rounded-xl px-3 py-2.5 text-[12.5px] leading-relaxed font-body outline-none resize-none"
                            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--t2)' }}
                            onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                          />
                        )}
                      </div>

                      <CopyButton text={q.question} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-8 text-center" style={{ color: 'var(--t5)' }}>
            <Code className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-[13px]">No {filter} questions</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
