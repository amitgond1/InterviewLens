import { useState } from 'react';
import { Download, ChevronDown, FileText, Clipboard, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function buildMarkdown(result) {
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const lines = [];

  lines.push(`# Interview Prep: ${result.role || 'Software Engineer'}${result.company ? ` @ ${result.company}` : ''}`);
  lines.push(`**Level:** ${result.experience_level || 'N/A'} · **Generated:** ${now}\n`);

  if (result.skills) {
    lines.push('## Required Skills\n');
    if (result.skills.technical?.length) {
      lines.push('**Technical:** ' + result.skills.technical.join(', '));
    }
    if (result.skills.soft?.length) {
      lines.push('**Soft Skills:** ' + result.skills.soft.join(', '));
    }
    if (result.keyTechnologies?.length) {
      lines.push('**Key Technologies:** ' + result.keyTechnologies.join(', '));
    }
    lines.push('');
  }

  if (result.resumeKeywords?.length) {
    lines.push('## ATS Resume Keywords\n');
    lines.push(result.resumeKeywords.join(' · '));
    lines.push('');
  }

  if (result.dsaQuestions?.length) {
    lines.push('## DSA Questions\n');
    result.dsaQuestions.forEach((q, i) => {
      lines.push(`### ${i + 1}. [${q.difficulty}] ${q.question}`);
      lines.push(`**Topic:** ${q.topic}`);
      if (q.leetcode_similar) lines.push(`**Similar:** ${q.leetcode_similar}`);
      if (q.hint) lines.push(`**Hint:** ${q.hint}`);
      lines.push('');
    });
  }

  if (result.behavioralQuestions?.length) {
    lines.push('## Behavioral Questions\n');
    result.behavioralQuestions.forEach((q, i) => {
      lines.push(`### ${i + 1}. ${q.question}`);
      lines.push(`**Category:** ${q.category}`);
      if (q.starTip) lines.push(`**STAR Tip:** ${q.starTip}`);
      lines.push('');
    });
  }

  if (result.prepChecklist?.length) {
    lines.push('## Prep Checklist\n');
    result.prepChecklist.forEach(item => {
      lines.push(`- [ ] [${item.priority}] ${item.task} *(${item.estimatedHours}h)*`);
    });
    lines.push('');
  }

  if (result.systemDesignTopics?.length) {
    lines.push('## System Design Topics\n');
    result.systemDesignTopics.forEach(t => lines.push(`- ${t}`));
    lines.push('');
  }

  if (result.interviewTips?.length) {
    lines.push('## Interview Tips\n');
    result.interviewTips.forEach((t, i) => {
      lines.push(`${i + 1}. **[${t.category}]** ${t.tip}`);
    });
  }

  return lines.join('\n');
}

export default function ExportButton({ result }) {
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleDownload = () => {
    const md   = buildMarkdown(result);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `interview-prep-${(result.role || 'analysis').toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
    toast.success('Downloaded!');
  };

  const handleCopy = async () => {
    const md = buildMarkdown(result);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
        style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)', color: 'var(--t3)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-brand)'; e.currentTarget.style.color = 'var(--t1)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--t3)'; }}
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-3.5 h-3.5" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-20 rounded-xl overflow-hidden w-48"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-hover)' }}
            >
              <button
                onClick={handleDownload}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[13px] transition-colors text-left"
                style={{ color: 'var(--t2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-soft)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FileText className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />
                Download .md
              </button>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[13px] transition-colors text-left"
                style={{ color: 'var(--t2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-soft)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" style={{ color: 'var(--brand-light)' }} />}
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
