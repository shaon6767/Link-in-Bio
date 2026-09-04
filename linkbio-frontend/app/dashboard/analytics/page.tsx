"use client";

import DashboardNav from "@/components/DashboardNav";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

interface Analytics {
  totalClicks: number;
  dailyClicks: { date: string; count: number }[];
  topLinks: { title: string; clicks: number }[];
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!user) return;

    apiFetch(`/api/links/analytics`, {}, { redirectOnFail: true })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setStats(data ?? { totalClicks: 0, dailyClicks: [], topLinks: [] });
      })
      .catch(() => setStats({ totalClicks: 0, dailyClicks: [], topLinks: [] }));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <DashboardNav />
        <div className="mx-auto max-w-2xl p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const maxCount = Math.max(
    1,
    ...(stats?.dailyClicks.map((d) => d.count) || [1]),
  );

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="top">Top Links</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="rounded-lg border p-6">
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-3xl font-bold">{stats?.totalClicks || 0}</p>
            </div>

            <div className="rounded-lg border p-6">
              <p className="text-sm text-muted-foreground mb-3">Last 14 days</p>
              <div className="flex items-end gap-1 h-24">
                {stats?.dailyClicks.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center gap-1"
                    title={`${d.date}: ${d.count} clicks`}
                  >
                    <div
                      className="w-full bg-primary rounded-sm"
                      style={{
                        height: `${Math.max(4, (d.count / maxCount) * 100)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="top" className="mt-4 space-y-3">
            {stats?.topLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">No clicks yet.</p>
            )}
            {stats?.topLinks.map((link, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <span className="font-medium">{link.title}</span>
                <span className="text-sm text-muted-foreground">
                  {link.clicks} clicks
                </span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
