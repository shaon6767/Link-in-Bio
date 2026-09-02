import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">LinkBio</h1>
        <p className="text-xl mb-8">Create your personalized link-in-bio profile</p>
        <div className="flex gap-4">
          <Link href="/signup">
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button className="rounded-md border px-4 py-2 hover:bg-accent">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
