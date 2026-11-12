import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';

export default function Layout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-background text-foreground', className)}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="font-display text-xl font-medium tracking-tight">
            Studio
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  'transition-colors duration-150 hover:text-primary',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )
              }
            >
              Contact
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm md:px-8">
          © {new Date().getFullYear()} Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
