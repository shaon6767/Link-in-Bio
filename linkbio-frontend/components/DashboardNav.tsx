"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Links" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl">
          LinkBio
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            >
              View page <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
