import { motion } from 'framer-motion';

export default function AnimatedBadge({ children, dot = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'backOut' }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono font-medium"
      style={{ background: 'var(--brand-soft)', border: '1px solid var(--brand-border)', color: 'var(--brand-light)' }}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: 'var(--brand-light)' }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--brand-light)' }} />
        </span>
      )}
      {children}
    </motion.div>
  );
}
