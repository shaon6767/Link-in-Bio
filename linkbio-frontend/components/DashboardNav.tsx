'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Links' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl">
          LinkBio
        </Link>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
