'use client';

import { Link } from '@/interfaces/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface LinkCardProps {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

export default function LinkCard({ link, onEdit, onDelete, onToggle }: LinkCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between rounded-lg border p-4 bg-background">
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing">
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="space-y-1">
          <p className="font-medium">{link.title}</p>
          <p className="text-sm text-muted-foreground">{link.url}</p>
          <p className="text-xs text-muted-foreground">{link.clickCount} clicks</p>
        </div>
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