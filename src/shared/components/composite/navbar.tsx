"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LeafIcon,
  MenuIcon,
  BookmarkIcon,
  LayoutDashboardIcon,
  ShieldIcon,
  LogOutIcon,
  ChevronDownIcon,
  LayoutGridIcon,
  CompassIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/shared/components/ui/sheet";
import { SearchBar } from "./search-bar";
import { ThemeSwitcher } from "./theme-switcher";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { useCurrentUser, useHasMinimumRole } from "@/features/auth/hooks/use-role";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useCategoryTree } from "@/features/categories/hooks/use-categories";
import { ROUTES } from "@/config/routes";

const REFERENCE_DATA_LINKS = [
  { label: "Disease Library", href: ROUTES.diseases },
  { label: "Scheme Finder", href: ROUTES.schemes },
  { label: "Machinery Directory", href: ROUTES.machinery },
  { label: "Market Prices & Weather", href: ROUTES.marketPricesWeather },
  { label: "Roadmaps", href: ROUTES.roadmaps },
];

/**
 * FIX: categories used to render as a flat inline link list next to the
 * search bar. Flex items don't shrink below their own content's
 * min-content width by default, so once real category names (e.g.
 * "Government Schemes & Finance") pushed that list past ~700px, the
 * search bar's flex-1 wrapper was left with almost nothing — it doesn't
 * overflow, it just collapses toward zero width. Moving categories into
 * a dropdown (same pattern as "Explore") keeps the nav's own width
 * constant regardless of how many categories exist, so the search bar
 * always gets its real space. This also reads cleaner — closer to how
 * GFG's own nav stays to a couple of dropdown triggers rather than
 * spelling out every category inline.
 */
export function Navbar() {
  const { user, isAuthenticated } = useCurrentUser();
  const canAccessAdmin = useHasMinimumRole("EDITOR");
  const logout = useLogout();
  const { data: categories } = useCategoryTree();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const initials = user?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link
          href={ROUTES.home}
          className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold"
        >
          <LeafIcon className="size-6 text-primary" aria-hidden="true" />
          AgriVerse
        </Link>

        <nav aria-label="Primary" className="hidden shrink-0 items-center gap-1 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
              <LayoutGridIcon className="size-4" />
              Categories
              <ChevronDownIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-96 overflow-y-auto">
              {categories?.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link href={ROUTES.category(category.slug)}>{category.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground">
              <CompassIcon className="size-4" />
              Explore
              <ChevronDownIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {REFERENCE_DATA_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden flex-1 justify-center sm:flex">
          <SearchBar className="w-full max-w-md" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <ThemeSwitcher />
          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Account menu"
                  className="rounded-full"
                >
                  <Avatar className="size-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.dashboard}>
                    <LayoutDashboardIcon />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {canAccessAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.admin}>
                      <ShieldIcon />
                      Admin panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.bookmarks}>
                    <BookmarkIcon />
                    Bookmarks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => logout.mutate()}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href={ROUTES.login}>Log in</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.register}>Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="mt-8 flex flex-col gap-1 px-4">
                <SearchBar className="mb-4" autoFocus />
                {categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={ROUTES.category(category.slug)}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="mt-2 border-t border-border pt-2">
                  {REFERENCE_DATA_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileNavOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                {!isAuthenticated && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    <Button variant="outline" asChild>
                      <Link href={ROUTES.login}>Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link href={ROUTES.register}>Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
