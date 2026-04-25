import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, Target, BookOpen, CheckSquare, ChevronRight,
  Brain, FileSearch, Timer, StickyNote, Filter, Download
} from 'lucide-react';
import AnimatedBadge from '../components/UI/AnimatedBadge';

const features = [
  { icon: Target,      title: 'Skill Extraction',      desc: 'Every technical and soft skill extracted from any job description — nothing missed.',                ic: '#a78bfa', ib: 'rgba(139,92,246,0.10)' },
  { icon: Zap,         title: 'DSA Questions',          desc: '8 tailored algorithm questions with difficulty ratings, hints & LeetCode references.',                 ic: '#38bdf8', ib: 'rgba(56,189,248,0.08)'  },
  { icon: BookOpen,    title: 'Behavioral Prep',         desc: 'STAR-format questions matched to your role\'s seniority and responsibilities.',                       ic: '#818cf8', ib: 'rgba(129,140,248,0.10)' },
  { icon: CheckSquare, title: 'Prep Checklist',          desc: 'Prioritized action plan with time estimates covering every interview dimension.',                      ic: '#34d399', ib: 'rgba(52,211,153,0.08)'  },
  { icon: Brain,       title: 'Mock Interview',          desc: 'Flashcard practice mode — flip cards, rate confidence, track mastery across all questions.',           ic: '#f59e0b', ib: 'rgba(245,158,11,0.08)'  },
  { icon: FileSearch,  title: 'Resume Keywords',         desc: '15-20 ATS-optimized keywords to copy directly into your resume for the role.',                        ic: '#fb7185', ib: 'rgba(251,113,133,0.08)' },
  { icon: Download,    title: 'Export Analysis',         desc: 'Download your full prep kit as Markdown or copy to clipboard with one click.',                         ic: '#4ade80', ib: 'rgba(74,222,128,0.08)'  },
  { icon: StickyNote,  title: 'Personal Notes',          desc: 'Add your own notes to every DSA and behavioral question — saved locally.',                            ic: '#fbbf24', ib: 'rgba(251,191,36,0.08)'  },
];

const steps = [
  { n: '01', title: 'Paste the JD',   desc: 'Copy any job description from LinkedIn, Indeed, or a company careers page.' },
  { n: '02', title: 'AI Analyzes',    desc: 'Claude extracts skills, generates questions, keywords, and builds your prep plan.' },
  { n: '03', title: 'Start Prepping', desc: 'Work through your study roadmap or jump into Mock Interview for flashcard practice.' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const up = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

export default function Home() {
  const navigate = useNavigate();
  const [lastAnalysis, setLastAnalysis] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('il-last-analysis');
      if (saved) setLastAnalysis(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="min-h-screen gradient-mesh grid-overlay" style={{ background: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-5 pt-16 pb-24 md:pt-24">

        {/* Quick-continue banner */}
        {lastAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            onClick={() => navigate('/mock')}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-soft)' }}>
              <Brain className="w-5 h-5" style={{ color: 'var(--brand-light)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--brand)' }}>Continue Preparing</p>
              <p className="font-display font-semibold text-[14px] truncate" style={{ color: 'var(--t1)' }}>
                {lastAnalysis.role || 'Software Engineer'}
                {lastAnalysis.company ? ` @ ${lastAnalysis.company}` : ''}
              </p>
            </div>
            <span className="flex items-center gap-1 text-[12px] font-medium shrink-0" style={{ color: 'var(--brand-light)' }}>
              Mock Interview <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>
        )}

        {/* Hero */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="text-center mb-20">
          <motion.div variants={up} className="mb-7 flex justify-center">
            <AnimatedBadge>Powered by Claude AI</AnimatedBadge>
          </motion.div>

          <motion.h1
            variants={up}
            className="font-display font-bold leading-[1.06] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-[70px] mb-6"
            style={{ color: 'var(--t1)' }}
          >
            Nail Every Interview
            <br />
            <span className="text-gradient">With Precision</span>
          </motion.h1>

          <motion.p variants={up} className="text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed font-light" style={{ color: 'var(--t4)' }}>
            Paste a job description. Get AI-extracted skills, tailored DSA questions, behavioral prep, resume keywords, and a complete study plan — in seconds.
          </motion.p>

          <motion.div variants={up} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              onClick={() => navigate('/analyze')}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-primary text-[15px] px-7 py-3.5 w-full sm:w-auto justify-center"
            >
              Analyze a Job Description <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/mock')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn-ghost text-[14px] w-full sm:w-auto justify-center"
            >
              <Brain className="w-4 h-4" />Mock Interview
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features 2×4 grid */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title} variants={up} whileHover={{ y: -3 }}
              className="p-5 rounded-2xl cursor-default transition-all duration-300"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: f.ib }}>
                <f.icon className="w-4.5 h-4.5" style={{ color: f.ic }} />
              </div>
              <h3 className="font-display font-semibold text-[14px] mb-1" style={{ color: 'var(--t1)' }}>{f.title}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--t4)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="pt-16"
        >
          <p className="text-center text-[10.5px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--t5)' }}>How it works</p>
          <h2 className="text-center font-display text-2xl md:text-3xl font-bold mb-12" style={{ color: 'var(--t1)' }}>
            Three steps to interview-ready
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="text-center p-5"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--brand-soft)', border: '1px solid var(--brand-border)' }}>
                  <span className="font-display font-bold text-lg" style={{ color: 'var(--brand-light)' }}>{s.n}</span>
                </div>
                <h4 className="font-display font-semibold text-[15px] mb-2" style={{ color: 'var(--t1)' }}>{s.title}</h4>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t4)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
