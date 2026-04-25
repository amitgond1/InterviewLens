import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, StickyNote } from 'lucide-react';
import CopyButton from '../UI/CopyButton';

const catCls = {
  Leadership: 'badge-amber', 'Conflict Resolution': 'badge-red',
  Achievement: 'badge-green', Teamwork: 'badge-sky',
  'Problem Solving': 'badge-violet', Adaptability: 'badge-indigo', Communication: 'badge-rose',
};

function getNotes() {
  try { return JSON.parse(localStorage.getItem('il-beh-notes') || '{}'); } catch { return {}; }
}
function saveNotes(notes) {
  localStorage.setItem('il-beh-notes', JSON.stringify(notes));
}

export default function BehavioralCard({ questions }) {
  const [notes,    setNotes]    = useState(getNotes);
  const [noteOpen, setNoteOpen] = useState({});

  const handleNote = (key, val) => {
    const updated = { ...notes, [key]: val };
    setNotes(updated);
    saveNotes(updated);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft)' }}>
            <MessageSquare className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
          </div>
          <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--t1)' }}>Behavioral Questions</h3>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg badge-amber">
          <Star className="w-3 h-3" fill="currentColor" />STAR Format
        </span>
      </div>

      <div className="space-y-3">
        {questions?.map((q, i) => {
          const key = q.question.slice(0, 40);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
              className="p-4 rounded-xl transition-colors"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div className="flex items-start gap-3">
                <span className="font-display font-extrabold text-[22px] leading-none mt-0.5 shrink-0 w-8" style={{ color: 'var(--t6)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium leading-snug mb-2.5" style={{ color: 'var(--t1)' }}>{q.question}</p>
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    <span className={`text-[10.5px] font-mono px-2.5 py-0.5 rounded-full ${catCls[q.category] || 'badge-violet'}`}>
                      {q.category}
                    </span>
                    {q.starTip && (
                      <span className="text-[12px] leading-snug flex-1" style={{ color: 'var(--t4)' }}>{q.starTip}</span>
                    )}
                  </div>

                  {/* Notes */}
                  <button
                    onClick={() => setNoteOpen(p => ({ ...p, [i]: !p[i] }))}
                    className="flex items-center gap-1.5 text-[11.5px] font-medium mb-1.5 transition-colors"
                    style={{ color: noteOpen[i] ? 'var(--brand-light)' : 'var(--t5)' }}
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                    {noteOpen[i] ? 'Hide' : notes[key] ? 'Edit note' : 'Add STAR answer'}
                    {notes[key] && !noteOpen[i] && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-1" />}
                  </button>
                  {noteOpen[i] && (
                    <textarea
                      value={notes[key] || ''}
                      onChange={e => handleNote(key, e.target.value)}
                      placeholder="Situation: ...\nTask: ...\nAction: ...\nResult: ..."
                      rows={4}
                      className="w-full rounded-xl px-3 py-2.5 text-[12.5px] leading-relaxed font-body outline-none resize-none mb-2"
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--t2)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  )}

                  <CopyButton text={q.question} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
