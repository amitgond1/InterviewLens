import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

const sections = [
  { key: 'technical', label: 'Technical Skills',  cls: 'badge-violet', dot: '#a78bfa' },
  { key: 'soft',      label: 'Soft Skills',        cls: 'badge-sky',    dot: '#38bdf8' },
];

export default function SkillsCard({ skills, technologies }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 card">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft)' }}>
          <Code2 className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
        </div>
        <h3 className="font-display font-bold text-[15px]" style={{ color: 'var(--t1)' }}>Required Skills</h3>
      </div>

      <div className="space-y-5">
        {sections.map(({ key, label, cls, dot }) => {
          const items = skills?.[key];
          if (!items?.length) return null;
          return (
            <div key={key}>
              <p className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-wider mb-2.5" style={{ color: 'var(--t5)' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dot }} />
                {label}
                <span className="ml-auto" style={{ color: 'var(--t6)' }}>({items.length})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((s, i) => (
                  <motion.span
                    key={s} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.025 }}
                    className={`px-3 py-1 rounded-full text-[11.5px] font-mono cursor-default ${cls}`}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          );
        })}

        {technologies?.length > 0 && (
          <div>
            <p className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-wider mb-2.5" style={{ color: 'var(--t5)' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#34d399' }} />
              Key Technologies
              <span className="ml-auto" style={{ color: 'var(--t6)' }}>({technologies.length})</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((t, i) => (
                <motion.span
                  key={t} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="px-3 py-1 rounded-full text-[11.5px] font-mono cursor-default badge-green"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
