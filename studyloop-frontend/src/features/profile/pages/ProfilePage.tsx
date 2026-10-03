import { LogOut, Mail, User } from "lucide-react";

import { useAuth } from "../../../app/providers/AuthProvider";

export function ProfilePage() {
  const { user, logout } = useAuth();

  const initials = `${user?.firstName?.[0] ?? ""}${
    user?.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

        <p className="mt-1 text-sm text-[var(--muted)]">
          View your StudyLoop account information.
        </p>
      </div>

      {/* Profile Card */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="h-28 bg-[var(--primary)]/10" />

        <div className="px-5 pb-6">
          {/* Avatar */}
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--surface)] bg-[var(--primary)] text-2xl font-bold text-[var(--primary-foreground)]">
            {initials || <User size={28} />}
          </div>

          {/* Name */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              StudyLoop learner
            </p>
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Account Information</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Information associated with your account.
          </p>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {/* Name */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="rounded-lg bg-[var(--surface-hover)] p-2">
              <User size={18} />
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">Name</p>

              <p className="mt-1 text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="rounded-lg bg-[var(--surface-hover)] p-2">
              <Mail size={18} />
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">Email</p>

              <p className="mt-1 text-sm font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Session */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Session</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage your current StudyLoop session.
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
