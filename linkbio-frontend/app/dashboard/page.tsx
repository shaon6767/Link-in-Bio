'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import LinkCard from '@/components/LinkCard';
import DashboardNav from '@/components/DashboardNav';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import type { Link } from '@/interfaces/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({ title: '', url: '', isActive: true });

  const fetchLinks = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setLinks(data);
    }
  };

  useEffect(() => {
    if (user) fetchLinks();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingLink
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/links/${editingLink._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/links`;
    const method = editingLink ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    if (res.ok) {
      setOpen(false);
      setEditingLink(null);
      setFormData({ title: '', url: '', isActive: true });
      fetchLinks();
    }
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setFormData({ title: link.title, url: link.url, isActive: link.isActive });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchLinks();
  };

  const handleToggle = async (link: Link) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links/${link._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !link.isActive }),
      credentials: 'include',
    });
    fetchLinks();
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <DashboardNav />
        <div className="mx-auto max-w-2xl p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="mx-auto max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Links</h1>
          <Button onClick={() => { setEditingLink(null); setFormData({ title: '', url: '', isActive: true }); setOpen(true); }}>
            Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {links.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No links yet. Add your first link!</p>
          ) : (
            links.map((link) => (
              <LinkCard
                key={link._id}
                link={link}
                onEdit={() => handleEdit(link)}
                onDelete={() => handleDelete(link._id)}
                onToggle={() => handleToggle(link)}
              />
            ))
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{editingLink ? 'Edit Link' : 'Add Link'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full">{editingLink ? 'Update' : 'Add'}</Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
