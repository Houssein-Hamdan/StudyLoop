import {
  BarChart3,
  ClipboardCheck,
  Home,
  Library,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Library', path: '/library', icon: Library },
  { label: 'Reviews', path: '/reviews', icon: ClipboardCheck },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
      <div className="grid grid-cols-4">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 text-xs ${
                isActive
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--muted)]'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}