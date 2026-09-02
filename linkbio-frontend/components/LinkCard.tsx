'use client';

import { Link } from '@/interfaces/link';

interface LinkCardProps {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

export default function LinkCard({ link, onEdit, onDelete, onToggle }: LinkCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <p className="font-medium">{link.title}</p>
        <p className="text-sm text-muted-foreground">{link.url}</p>
        <p className="text-xs text-muted-foreground">{link.clickCount} clicks</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onToggle} className="text-sm">
          {link.isActive ? 'Hide' : 'Show'}
        </button>
        <button onClick={onEdit} className="text-sm text-primary">
          Edit
        </button>
        <button onClick={onDelete} className="text-sm text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
}
