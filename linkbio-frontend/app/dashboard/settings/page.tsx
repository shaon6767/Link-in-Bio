"use client";

import DashboardNav from "@/components/DashboardNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("#000000");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setTheme(user.theme || "#000000");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await apiFetch(
      `/api/profile`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, theme, avatarUrl }),
      },
      { redirectOnFail: true },
    );
    setSaving(false);
    if (res.ok) {
      toast.success("Profile saved");
    } else {
      toast.error("Failed to save profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    const res = await apiFetch(
      `/api/auth/password`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      },
      { redirectOnFail: true },
    );
    setPasswordSaving(false);
    if (res.ok) {
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      const data = await res.json().catch(() => null);
      toast.error(data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <Tabs defaultValue="appearance">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={160}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme Color</Label>
                <Input
                  id="theme"
                  type="color"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  placeholder="www.example.com/photo.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="account" className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={user?.username || ""} disabled />
            </div>
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 pt-2 border-t"
            >
              <p className="text-sm font-medium pt-4">Change password</p>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" disabled={passwordSaving}>
                {passwordSaving ? "Updating..." : "Update password"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
