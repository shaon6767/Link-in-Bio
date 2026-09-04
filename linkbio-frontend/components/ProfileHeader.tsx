"use client";

interface ProfileHeaderProps {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  theme?: string;
}

export default function ProfileHeader({
  username,
  name,
  bio,
  avatarUrl,
  theme,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          className="h-24 w-24 rounded-full object-cover ring-4"
          style={
            theme
              ? ({ "--tw-ring-color": theme } as React.CSSProperties)
              : undefined
          }
        />
      )}
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-muted-foreground">@{username}</p>
      {bio && <p className="text-sm">{bio}</p>}
    </div>
  );
}
