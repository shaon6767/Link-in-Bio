'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import DashboardNav from '@/components/DashboardNav';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('#000000');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setTheme(user.theme || '#000000');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio, theme, avatarUrl }),
      credentials: 'include',
    });
    setSaving(false);
  };

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <Tabs defaultValue="appearance">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme Color</Label>
                <Input id="theme" type="color" value={theme} onChange={(e) => setTheme(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
              </div>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </form>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <p className="text-sm text-muted-foreground">Account settings coming soon.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
