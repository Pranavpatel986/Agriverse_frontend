import Link from "next/link";
import { LeafIcon } from "lucide-react";
import { ROUTES } from "@/config/routes";

/**
 * Deliberately does not import Navbar/Footer/SearchBar — the Frontend
 * Technical Specification calls this out explicitly ("ships a minimal
 * JS bundle... so the login page loads and becomes interactive as fast
 * as possible"). Keep it that way even as the rest of the app grows.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      className="bg-canopy-900 flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-12"
    >
      <Link
        href={ROUTES.home}
        className="font-display text-canopy-50 mb-8 flex items-center gap-2 text-xl font-semibold"
      >
        <LeafIcon className="size-7" aria-hidden="true" />
        AgriVerse
      </Link>
      <div className="border-canopy-800 bg-card w-full max-w-md rounded-xl border p-6 shadow-lg sm:p-8">
        {children}
      </div>
    </main>
  );
}
