import Link from "next/link";
import { LeafIcon } from "lucide-react";
import { ROUTES } from "@/config/routes";

const FOOTER_LINKS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Home", href: ROUTES.home },
      { label: "Search", href: ROUTES.search },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: ROUTES.login },
      { label: "Sign up", href: ROUTES.register },
      { label: "Bookmarks", href: ROUTES.bookmarks },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border bg-muted/40 border-t">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 lg:col-span-2">
          <Link
            href={ROUTES.home}
            className="font-display flex items-center gap-2 text-lg font-semibold"
          >
            <LeafIcon className="text-primary size-5" aria-hidden="true" />
            AgriVerse
          </Link>
          <p className="text-muted-foreground max-w-xs text-sm">
            Structured, practical agricultural knowledge for Indian farmers — crop guides,
            disease diagnosis, schemes, prices, and more.
          </p>
        </div>

        {FOOTER_LINKS.map((section) => (
          <nav key={section.heading} aria-label={section.heading}>
            <h2 className="text-foreground mb-3 text-sm font-semibold">
              {section.heading}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-muted-foreground hover:text-foreground text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-border text-muted-foreground border-t px-4 py-4 text-center text-xs">
        © {new Date().getFullYear()} AgriVerse. All rights reserved.
      </div>
    </footer>
  );
}
