import { Outlet } from "react-router-dom";
import { Sidebar } from "../../navigation/Sidebar";
import { MobileNavigation } from "../../navigation/MobileNavigation";
import { MobileHeader } from "../../navigation/MobileHeader"; // 👈 استيراد المكون الجديد

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 👈 استخدام MobileHeader المحدث هنا */}
        <MobileHeader />

        <main className="flex-1 overflow-x-hidden p-4 pb-24 md:p-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}