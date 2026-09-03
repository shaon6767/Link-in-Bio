"use client";

import DashboardNav from "@/components/DashboardNav";
import LinkCard from "@/components/LinkCard";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import type { Link } from "@/interfaces/link";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { z } from "zod";

const urlSchema = z
  .string()
  .trim()
  .url({ message: "Enter a valid URL, e.g. https://example.com" });

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    isActive: true,
  });
  const [urlError, setUrlError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const fetchLinks = async () => {
    const res = await fetch(`/api/links`, {
      credentials: "include",
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

    const result = urlSchema.safeParse(formData.url);
    if (!result.success) {
      setUrlError(result.error.issues[0].message);
      return;
    }
    setUrlError("");

    const url = editingLink ? `/api/links/${editingLink._id}` : `/api/links`;
    const method = editingLink ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, url: result.data }),
      credentials: "include",
    });

    if (res.ok) {
      setOpen(false);
      setEditingLink(null);
      setFormData({ title: "", url: "", isActive: true });
      fetchLinks();
    }
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setFormData({ title: link.title, url: link.url, isActive: link.isActive });
    setUrlError("");
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/links/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchLinks();
  };

  const handleToggle = async (link: Link) => {
    await fetch(`/api/links/${link._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !link.isActive }),
      credentials: "include",
    });
    fetchLinks();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l._id === active.id);
    const newIndex = links.findIndex((l) => l._id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);
    setLinks(reordered);

    await fetch(`/api/links/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        links: reordered.map((l, index) => ({ id: l._id, order: index })),
      }),
      credentials: "include",
    });
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
          <Button
            onClick={() => {
              setEditingLink(null);
              setFormData({ title: "", url: "", isActive: true });
              setUrlError("");
              setOpen(true);
            }}
          >
            Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {links.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No links yet. Add your first link!
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map((l) => l._id)}
                strategy={verticalListSortingStrategy}
              >
                {links.map((link) => (
                  <LinkCard
                    key={link._id}
                    link={link}
                    onEdit={() => handleEdit(link)}
                    onDelete={() => handleDelete(link._id)}
                    onToggle={() => handleToggle(link)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? "Edit Link" : "Add Link"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value });
                  setUrlError("");
                }}
                required
              />
              {urlError && <p className="text-sm text-red-500">{urlError}</p>}
            </div>
            <Button type="submit" className="w-full">
              {editingLink ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
