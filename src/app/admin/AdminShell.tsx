'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { CarFront, Building2, LayoutDashboard, Home, LogOut, Menu, Hotel, TreePine, CalendarCheck, Package } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin?tab=cars', label: 'Cars', icon: CarFront },
  { href: '/admin?tab=apartments', label: 'Apartments', icon: Building2 },
  { href: '/admin?tab=hotels', label: 'Hotels', icon: Hotel },
  { href: '/admin?tab=villas', label: 'Villas', icon: TreePine },
  { href: '/admin?tab=reservations', label: 'Reservations', icon: CalendarCheck },
  { href: '/admin?tab=bundles', label: 'Bundles', icon: Package },
];

function SidebarNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || '';

  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ href, label, icon: Icon }) => {
        const tabParam = new URLSearchParams(href.split('?')[1] || '').get('tab') || '';
        const isActive = tabParam ? currentTab === tabParam : pathname === '/admin' && !currentTab;
        return (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[hsl(42,55%,50%)]/15 text-[hsl(42,55%,50%)] shadow-sm'
                : 'text-[hsl(40,25%,70%)] hover:bg-white/5 hover:text-[hsl(40,25%,92%)]'
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLogin = pathname === '/admin/login';
  const [mobileOpen, setMobileOpen] = useState(false);
  const userEmail = session?.user?.email ?? null;

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex" dir="ltr" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      {/* Desktop sidebar — dark, matching site navbar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-foreground border-r border-white/10">
        {/* Brand */}
        <div className="flex h-16 items-center px-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[hsl(42,55%,50%)] to-[hsl(42,65%,62%)] flex items-center justify-center shadow-lg shadow-[hsl(42,55%,50%)]/20">
              <span className="text-foreground font-bold text-sm">SAB</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-[hsl(40,25%,92%)] text-sm leading-tight truncate">Shams Al Bosnia</span>
              <span className="text-[11px] text-[hsl(40,25%,70%)] leading-tight">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-[hsl(40,25%,50%)]">
            Management
          </p>
          <SidebarNav />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {userEmail && (
            <p className="px-2 text-xs text-[hsl(40,25%,60%)] truncate" title={userEmail}>
              {userEmail}
            </p>
          )}
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-[hsl(40,25%,70%)] hover:text-[hsl(40,25%,92%)] hover:bg-white/5"
              >
                <Home className="mr-2 h-4 w-4" />
                Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-[hsl(40,25%,70%)] hover:text-red-400 hover:bg-red-500/10"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-foreground md:bg-card/95 md:backdrop-blur px-4 md:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-[hsl(40,25%,92%)]">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-foreground border-r border-white/10">
              <SheetHeader className="p-4 border-b border-white/10">
                <SheetTitle className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(42,55%,50%)] to-[hsl(42,65%,62%)] flex items-center justify-center">
                    <span className="text-foreground font-bold text-xs">SAB</span>
                  </div>
                  <span className="text-sm font-semibold text-[hsl(40,25%,92%)]">Shams Al Bosnia Admin</span>
                </SheetTitle>
              </SheetHeader>
              <div className="px-3 py-5">
                <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-[hsl(40,25%,50%)]">
                  Management
                </p>
                <SidebarNav onLinkClick={() => setMobileOpen(false)} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-3">
                {userEmail && (
                  <p className="px-2 text-xs text-[hsl(40,25%,60%)] truncate">{userEmail}</p>
                )}
                <div className="flex gap-2">
                  <Link href="/" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-[hsl(40,25%,70%)] hover:text-[hsl(40,25%,92%)] hover:bg-white/5">
                      <Home className="mr-2 h-4 w-4" /> Site
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[hsl(40,25%,70%)] hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/admin/login' }); }}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile title */}
          <span className="text-sm font-medium text-[hsl(40,25%,92%)] md:text-foreground truncate block md:hidden">
            {pathname === '/admin' ? 'Dashboard' : 'Admin'}
          </span>

          {/* Desktop breadcrumb area */}
          <div className="hidden md:block" />
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
