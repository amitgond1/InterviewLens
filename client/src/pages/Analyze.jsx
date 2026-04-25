import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, Info, Brain } from 'lucide-react';
import JobDescriptionForm from '../components/JDInput/JobDescriptionForm';
import SkillsCard from '../components/Results/SkillsCard';
import DSAQuestionsCard from '../components/Results/DSAQuestionsCard';
import BehavioralCard from '../components/Results/BehavioralCard';
import PrepChecklist from '../components/Results/PrepChecklist';
import ResumeKeywordsCard from '../components/Results/ResumeKeywordsCard';
import SkeletonLoader from '../components/UI/SkeletonLoader';
import ExportButton from '../components/UI/ExportButton';
import InterviewTimer from '../components/UI/InterviewTimer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Analyze() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);

  const handleAnalyze = async (jobDescription) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const { data } = await api.post('/analyze', { jobDescription });
      setResult(data.data);
      // Persist so Mock Interview can read it
      localStorage.setItem('il-last-analysis', JSON.stringify(data.data));
      toast.success('Analysis complete!');
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) { setError(err.message); toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-10" style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-soft)' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
          </div>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--t1)' }}>Analyze Job Description</h1>
        </div>
        <p className="text-[13px] ml-11" style={{ color: 'var(--t4)' }}>
          Paste any job posting — get your personalized interview prep kit in ~10 seconds
        </p>
      </motion.div>

      {/* Auth nudge */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="mb-5 p-3 rounded-xl flex items-center gap-2.5"
          style={{ background: 'var(--brand-soft)', border: '1px solid var(--brand-border)' }}
        >
          <Info className="w-4 h-4 shrink-0" style={{ color: 'var(--brand-light)' }} />
          <p className="text-[12.5px]" style={{ color: 'var(--t3)' }}>
            <span className="font-medium" style={{ color: 'var(--brand-light)' }}>Sign in</span> to save your analyses and access them from History.
          </p>
        </motion.div>
      )}

      <JobDescriptionForm onAnalyze={handleAnalyze} loading={loading} />

      {/* Error */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-5 p-4 rounded-xl flex items-start gap-3"
            style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" style={{ color: '#f87171' }} />
            <div>
              <p className="text-[13px] font-medium" style={{ color: '#f87171' }}>Analysis failed</p>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(248,113,113,0.7)' }}>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div>
          <div className="mt-7 flex items-center gap-3 px-1">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand)' }} />
            <p className="text-[12px] font-mono animate-pulse" style={{ color: 'var(--t4)' }}>Claude is analyzing your job description…</p>
          </div>
          <SkeletonLoader />
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div id="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-5">

            {/* Role banner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl"
              style={{ background: 'var(--brand-soft)', border: '1px solid var(--brand-border)' }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--brand)' }}>Analyzing for</p>
                  <h2 className="font-display text-xl md:text-2xl font-bold leading-tight" style={{ color: 'var(--t1)' }}>
                    {result.role || 'Software Engineer'}
                    {result.company && <span className="font-normal text-lg" style={{ color: 'var(--t4)' }}> @ {result.company}</span>}
                  </h2>
                  <div className="flex items-center gap-2.5 mt-3 flex-wrap">
                    {result.experience_level && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono badge-violet">{result.experience_level}</span>
                    )}
                    {result.salaryRange && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono badge-green">
                        {result.salaryRange.currency === 'USD' ? '$' : ''}{(result.salaryRange.min/1000).toFixed(0)}k–{(result.salaryRange.max/1000).toFixed(0)}k
                      </span>
                    )}
                    <span className="text-[12px] font-mono" style={{ color: 'var(--t4)' }}>
                      {(result.skills?.technical?.length || 0) + (result.skills?.soft?.length || 0)} skills · {result.dsaQuestions?.length || 0} DSA questions
                    </span>
                  </div>
                </div>
                <ExportButton result={result} />
              </div>
            </motion.div>

            {/* Mock interview CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              onClick={() => navigate('/mock')}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
              style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(56,189,248,0.06))', border: '1px solid var(--brand-border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brand-border)'}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-soft)' }}>
                <Brain className="w-5 h-5" style={{ color: 'var(--brand-light)' }} />
              </div>
              <div>
                <p className="font-display font-bold text-[14px]" style={{ color: 'var(--t1)' }}>Start Mock Interview</p>
                <p className="text-[12px]" style={{ color: 'var(--t4)' }}>
                  Practice all {(result.dsaQuestions?.length || 0) + (result.behavioralQuestions?.length || 0)} questions with interactive flashcards
                </p>
              </div>
              <span className="ml-auto text-[11px] font-mono px-2.5 py-1 rounded-full badge-violet shrink-0">NEW</span>
            </motion.button>

            <SkillsCard skills={result.skills} technologies={result.keyTechnologies} />
            <ResumeKeywordsCard keywords={result.resumeKeywords} tips={result.interviewTips} />
            <DSAQuestionsCard questions={result.dsaQuestions} />
            <BehavioralCard questions={result.behavioralQuestions} />
            <PrepChecklist items={result.prepChecklist} systemDesign={result.systemDesignTopics} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating timer — always visible on analyze page */}
      <InterviewTimer />
    </div>
  );
}
