import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { buttonClass } from '@/components/ui';
import { cn } from '@/utils/cn';
import { lift } from '@/utils/lift';

const links = [
  { label: 'Our promise', href: '#promise' },
  { label: 'Details', href: '#details' },
  { label: 'FAQ', href: '#faq' },
];

const linkClass = 'transition-colors duration-150 hover:text-primary';

export default function Layout({ children, className }: { children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div id="top" className={cn('flex min-h-screen flex-col bg-background text-foreground', className)}>
      <div className="bg-primary px-4 py-2 text-center text-xs uppercase tracking-wider text-primary-foreground">
        Every message gets a reply within two working days
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8">
          <Link to="/" className="font-display text-2xl font-medium tracking-tight">
            Studio
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#form"
              className={buttonClass({
                size: 'sm',
                className: cn('hidden text-xs uppercase tracking-wider md:inline-flex', lift),
              })}
            >
              Write to us
            </a>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-menu" aria-label="Mobile" className="border-t border-border bg-background md:hidden">
            <ul className="mx-auto max-w-6xl px-4">
              {[...links, { label: 'Write to us', href: '#form' }].map((l) => (
                <li key={l.href} className="border-b border-border last:border-b-0">
                  <a href={l.href} onClick={() => setOpen(false)} className={cn('block py-4 text-sm', linkClass)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-primary-foreground/20 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:px-8">
          <div>
            <p className="font-display text-3xl font-medium tracking-tight">Studio</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Questions, ideas or just a hello. We read everything that lands in our inbox.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">On this page</p>
            <ul className="mt-4 space-y-2 text-sm">
              {[...links, { label: 'Write to us', href: '#form' }].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors duration-150 hover:text-primary-foreground/70">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-primary-foreground/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-primary-foreground/70 md:px-8">
            <span>© {new Date().getFullYear()} Studio. All rights reserved.</span>
            <a href="#top" className="uppercase tracking-wider transition-colors duration-150 hover:text-primary-foreground">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
