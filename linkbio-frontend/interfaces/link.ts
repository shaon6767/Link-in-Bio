export interface Link {
  _id: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
  clickCount: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  theme: string;
}
