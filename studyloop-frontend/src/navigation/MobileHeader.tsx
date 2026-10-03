import { Settings, User, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../app/providers/ThemeProvider";

export function MobileHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    // 👇 Zidna `sticky top-0 z-40` krmal ydal sebet faw2 lama te3mal scroll
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 md:hidden">
      {/* Title */}
      <h1 className="text-lg font-bold tracking-tight">StudyLoop</h1>

      {/* Action Icons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition"
          aria-label="Profile"
        >
          <User size={19} />
        </Link>

        <Link
          to="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition"
          aria-label="Settings"
        >
          <Settings size={19} />
        </Link>
      </div>
    </header>
  );
}

