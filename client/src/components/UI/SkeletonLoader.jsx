import { motion } from 'framer-motion';

const Block = ({ w = 'full', h = '4' }) => (
  <div className={`shimmer-card rounded-lg w-${w} h-${h}`} />
);

export default function SkeletonLoader() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mt-7 space-y-4">
      {/* Banner */}
      <div className="p-5 rounded-2xl space-y-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <Block w="28" h="3" />
        <Block w="72" h="7" />
        <Block w="20" h="5" />
      </div>

      {/* Cards */}
      {[['full','full','5/6'], ['full','full','full','5/6'], ['full','5/6','4/6'], ['full','full','5/6','4/6']].map((rows, i) => (
        <div key={i} className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <Block w="40" h="5" />
          <div className="space-y-2.5">
            {rows.map((w, j) => <Block key={j} w={w} h="11" />)}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
