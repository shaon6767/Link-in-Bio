import { cookies } from 'next/headers';

export async function getSession() {
  const accessToken = cookies().get('accessToken')?.value;
  if (!accessToken) return null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refreshToken=${cookies().get('refreshToken')?.value}` },
      credentials: 'include',
    });
    if (!res.ok) return null;
    return { accessToken };
  } catch {
    return null;
  }
}
