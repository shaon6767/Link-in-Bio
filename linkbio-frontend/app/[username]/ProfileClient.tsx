'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

interface Profile {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  theme: string;
}

interface Link {
  _id: string;
  title: string;
  url: string;
  isActive: boolean;
  clickCount: number;
}

export default function ProfileClient({ username }: { username: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${username}`)
      .then((res) => res.json())
      .then(async (data) => {
        setProfile(data);
        const linksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links`, {
          headers: { 'x-user-id': data._id },
        });
        if (linksRes.ok) {
          const linksData = await linksRes.json();
          setLinks(linksData.filter((l: Link) => l.isActive));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md p-6 space-y-4">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <div className="space-y-3 mt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6" style={{ '--theme': profile.theme } as React.CSSProperties}>
      <div className="flex flex-col items-center text-center space-y-3">
        {profile.avatarUrl && (
          <img src={profile.avatarUrl} alt={profile.name} className="h-24 w-24 rounded-full object-cover" />
        )}
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-muted-foreground">@{profile.username}</p>
        {profile.bio && <p className="text-sm">{profile.bio}</p>}
      </div>
      <div className="mt-6 space-y-3">
        {links.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No links yet</p>
          </Card>
        ) : (
          links.map((link) => (
            <a key={link._id} href={`${process.env.NEXT_PUBLIC_API_URL}/r/${link._id}`} target="_blank" rel="noopener noreferrer">
              <Card className="p-4 hover:bg-accent transition-colors w-full text-center">
                <span className="font-medium">{link.title}</span>
              </Card>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
