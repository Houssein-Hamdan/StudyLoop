import { Moon, Sun, LogOut, User } from "lucide-react";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useTheme } from "../../../app/providers/ThemeProvider";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Appearance */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Appearance</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Choose how StudyLoop looks.
          </p>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => toggleTheme()}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                theme === "light"
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div className="rounded-lg bg-[var(--surface-hover)] p-2">
                <Sun size={20} />
              </div>

              <div>
                <p className="text-sm font-medium">Light</p>

                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  Use the light appearance.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleTheme()}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                theme === "dark"
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div className="rounded-lg bg-[var(--surface-hover)] p-2">
                <Moon size={20} />
              </div>

              <div>
                <p className="text-sm font-medium">Dark</p>

                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  Use the dark appearance.
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Account</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Your current account information.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <User size={20} />
            </div>

            <div>
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-sm text-[var(--muted)]">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Session */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Session</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your current session.
          </p>
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--danger)]/30 px-4 py-2.5 text-sm font-medium text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </section>
    </div>
  );
}
