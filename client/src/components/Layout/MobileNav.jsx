import { NavLink } from 'react-router-dom';
import { Home, Search, History, User, Brain, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const links = [
  { to: '/',        icon: Home,    label: 'Home',    exact: true },
  { to: '/analyze', icon: Search,  label: 'Analyze' },
  { to: '/mock',    icon: Brain,   label: 'Mock' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/login',   icon: User,    label: 'Account' },
];

export default function MobileNav() {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();
  const navLinks = user ? links.filter(l => l.to !== '/login') : links;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ background: 'var(--bg-nav)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(24px)' }}
    >
      <div className="flex px-1 py-1">
        {navLinks.map(({ to, icon: Icon, label, exact }) => (
          <NavLink key={to} to={to} end={exact}
            className="flex-1 flex flex-col items-center py-2.5 gap-1 text-[9.5px] font-medium transition-all rounded-xl"
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5 transition-all" style={{ color: isActive ? 'var(--brand-light)' : 'var(--t4)', transform: isActive ? 'scale(1.1)' : 'scale(1)' }} />
                <span style={{ color: isActive ? 'var(--brand-light)' : 'var(--t4)' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button onClick={toggle} className="flex-1 flex flex-col items-center py-2.5 gap-1 text-[9.5px] font-medium" style={{ color: 'var(--t4)' }}>
          {isDark ? <><Sun className="w-5 h-5 text-amber-400" /><span>Light</span></> : <><Moon className="w-5 h-5" style={{ color: 'var(--brand)' }} /><span>Dark</span></>}
        </button>
      </div>
    </nav>
  );
}
