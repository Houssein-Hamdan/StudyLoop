import {
  BarChart3,
  ClipboardCheck,
  Home,
  Library,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../app/providers/ThemeProvider";

const navigation = [
  { label: "Home", path: "/", icon: Home },
  { label: "Library", path: "/library", icon: Library },
  { label: "Reviews", path: "/reviews", icon: ClipboardCheck },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4 md:flex">
      {" "}
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold">StudyLoop</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Learn. Review. Remember.
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-[var(--border)] pt-4">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-hover)]"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-hover)]"
        >
          <User size={18} />
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-hover)]"
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
