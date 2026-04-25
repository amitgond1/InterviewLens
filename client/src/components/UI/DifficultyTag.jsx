const config = {
  Easy:   { label: 'Easy',   dots: 1, cls: 'badge-green'  },
  Medium: { label: 'Medium', dots: 2, cls: 'badge-amber'  },
  Hard:   { label: 'Hard',   dots: 3, cls: 'badge-red'    },
};

export default function DifficultyTag({ difficulty }) {
  const { label, dots, cls } = config[difficulty] || config.Medium;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono ${cls}`}>
      <span className="flex gap-0.5 items-center">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className="inline-block w-1 h-1 rounded-full"
            style={{ background: 'currentColor', opacity: n <= dots ? 1 : 0.2 }}
          />
        ))}
      </span>
      {label}
    </span>
  );
}
