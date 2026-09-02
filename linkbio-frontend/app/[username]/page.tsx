import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username} | LinkBio`,
    description: `Check out ${params.username}'s links`,
    openGraph: {
      title: `${params.username} | LinkBio`,
      description: `Check out ${params.username}'s links`,
    },
  };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  return <ProfileClient username={params.username} />;
}
