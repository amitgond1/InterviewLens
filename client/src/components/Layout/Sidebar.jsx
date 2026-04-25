import { NavLink } from 'react-router-dom';
import { Home, Search, History, LogOut, Zap, User, Sun, Moon, Brain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const links = [
  { to: '/',        icon: Home,    label: 'Home',          exact: true },
  { to: '/analyze', icon: Search,  label: 'Analyze JD' },
  { to: '/mock',    icon: Brain,   label: 'Mock Interview', badge: 'NEW' },
  { to: '/history', icon: History, label: 'History' },
];

export default function Sidebar() {
  const { user, logout }  = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <nav
      className="fixed left-0 top-0 h-full w-60 flex flex-col py-6 px-4 z-40"
      style={{ background: 'var(--bg-nav)', borderRight: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', boxShadow: '0 4px 14px var(--brand-glow)' }}>
          <Zap className="w-4 h-4 text-white" fill="currentColor" />
        </div>
        <div>
          <p className="font-display font-bold text-[15px] leading-tight" style={{ color: 'var(--t1)' }}>InterviewLens</p>
          <p className="text-[9.5px] font-mono leading-tight tracking-widest" style={{ color: 'var(--brand)' }}>AI PREP PLATFORM</p>
        </div>
      </div>

      <div className="h-px mx-2 mb-5" style={{ background: 'var(--border)' }} />

      {/* Nav links */}
      <div className="space-y-1 flex-1">
        {links.map(({ to, icon: Icon, label, exact, badge }) => (
          <NavLink
            key={to} to={to} end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 group ${isActive ? 'nav-active' : 'nav-inactive'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                {label}
                {badge && (
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-full badge-violet">{badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Theme toggle */}
      <div className="px-1 pb-4">
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={{ color: 'var(--t3)', background: 'var(--brand-soft)', border: '1px solid var(--border)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.borderColor = 'var(--border-brand)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          {isDark ? <><Sun className="w-4 h-4 text-amber-400" />Light Mode</> : <><Moon className="w-4 h-4 text-brand-500" />Dark Mode</>}
          <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-surface2)', color: 'var(--t4)' }}>
            {isDark ? 'LIGHT' : 'DARK'}
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: 'var(--brand-soft)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-border)' }}>
                <User className="w-3.5 h-3.5" style={{ color: 'var(--brand-light)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--t1)' }}>{user.name}</p>
                <p className="text-[10px] font-mono truncate" style={{ color: 'var(--t4)' }}>{user.email}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all w-full"
              style={{ color: 'var(--t4)', border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--t4)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <LogOut className="w-4 h-4" />Sign Out
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all w-full"
            style={{ color: 'var(--brand-light)', background: 'var(--brand-soft)', border: '1px solid var(--brand-border)' }}>
            <User className="w-4 h-4" />Sign In to Save History
          </NavLink>
        )}
      </div>
    </nav>
  );
}
